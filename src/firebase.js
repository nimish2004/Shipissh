// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN_KEY,
  projectId: "shipment-app-9f364",
  storageBucket: "shipment-app-9f364.appspot.com",
  messagingSenderId: "900240389810",
  appId: "1:900240389810:web:ca3a4b9f95b441cb853bab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Fix: pass `app` to getAuth
export const auth = getAuth(app); 
  auth.languageCode = 'it'; // Optional

export const db = getFirestore(app);

// Optional: For browser console testing
if (typeof window !== "undefined") {
  window.db = db;
  window.addDoc = addDoc;
  window.collection = collection;
  window.Timestamp = Timestamp;
}
