import { auth } from "../services/firebaseService";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return signOut(auth);
} 