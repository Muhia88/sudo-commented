// src/firebase.js

// Import necessary functions from the Firebase SDKs.
import { initializeApp } from "firebase/app"; // Used to initialize a Firebase app instance.
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Used for authentication.
import { getFirestore } from "firebase/firestore"; // Used to interact with Firestore database.

// Firebase configuration object.
// These values are sourced from environment variables for security and flexibility.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize the Firebase app with the configuration.
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Authentication service.
export const auth = getAuth(app);

// Create a new instance of the Google Authentication provider.
export const googleProvider = new GoogleAuthProvider();

// Get a reference to the Cloud Firestore database service.
export const db = getFirestore(app);