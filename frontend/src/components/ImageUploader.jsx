import React, { useState } from "react";
import { storage } from "../services/firebaseService";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { analyzeImage } from "../services/analysisService";
import suggestions from "../models/suggestions";
import { db } from "../services/firebaseService";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../services/firebaseService";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const ImageUploader = ({ user }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }
    const storageRef = ref(storage, `uploads/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(percent);
      },
      (err) => {
        setError(err.message);
      },
      async () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          setDownloadURL(url);
          setError("");
          // Analyze the image after upload
          if (preview) {
            setAnalyzing(true);
            setAnalysisResult(null);
            setSuggestion("");
            const img = new window.Image();
            img.src = preview;
            img.onload = async () => {
              const result = await analyzeImage(img);
              setAnalysisResult(result);
              setAnalyzing(false);
              // Get suggestion
              const careSuggestion = suggestions[result.label] || suggestions["Unknown"];
              setSuggestion(careSuggestion);
              // Save to Firestore
              try {
                await addDoc(collection(db, "analysisResults"), {
                  imageUrl: url,
                  label: result.label,
                  confidence: result.confidence,
                  suggestion: careSuggestion,
                  timestamp: new Date(),
                  userId: user.uid
                });
              } catch (e) {
                setError("Failed to save result to database.");
              }
            };
            img.onerror = () => {
              setError("Failed to load image for analysis.");
              setAnalyzing(false);
            };
          }
        });
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Plant Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div className="my-4">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload
      </button>
      {progress > 0 && progress < 100 && (
        <div className="mt-2 text-sm">Uploading: {progress}%</div>
      )}
      {downloadURL && (
        <div className="mt-2 text-green-700 text-sm">
          Uploaded! <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="underline">View Image</a>
        </div>
      )}
      {analyzing && (
        <div className="mt-2 text-blue-600 text-sm">Analyzing image...</div>
      )}
      {analysisResult && (
        <div className="mt-2 text-green-800 text-sm">
          <strong>Prediction:</strong> {analysisResult.label} <br />
          <strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(1)}%
        </div>
      )}
      {suggestion && (
        <div className="mt-2 text-blue-800 text-sm">
          <strong>Suggestion:</strong> {suggestion}
        </div>
      )}
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default ImageUploader; 