import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseService";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const ResultsHistory = ({ user }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "analysisResults"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(data);
      } catch (e) {
        setResults([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, [user]);

  if (loading) return <div>Loading history...</div>;
  if (results.length === 0) return <div>No analysis history found.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">Your Analysis History</h2>
      <ul className="space-y-4">
        {results.map(result => (
          <li key={result.id} className="p-4 border rounded shadow bg-white flex gap-4 items-center">
            <img src={result.imageUrl} alt="Plant" className="w-24 h-24 object-cover rounded" />
            <div>
              <div><strong>Label:</strong> {result.label}</div>
              <div><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</div>
              <div><strong>Suggestion:</strong> {result.suggestion}</div>
              <div className="text-xs text-gray-500 mt-1">{result.timestamp?.toDate?.().toLocaleString?.() || String(result.timestamp)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsHistory; 