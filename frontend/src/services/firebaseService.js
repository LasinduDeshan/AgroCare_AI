import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOpefdgMMTyCUVJ6eIudzCQed5TiB0daU",
  authDomain: "agrocareai-7603b.firebaseapp.com",
  projectId: "agrocareai-7603b",
  storageBucket: "agrocareai-7603b.appspot.com",
  messagingSenderId: "643576448780",
  appId: "1:643576448780:web:a390ef29a0df45333aab29",
  measurementId: "G-481FV32CDP"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app); 