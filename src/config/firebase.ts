/**
 * Firebase Configuration
 * Initializes Firebase app, Auth, and Firestore instances
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that required config values are present
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    console.warn(
      `Missing Firebase config value: VITE_FIREBASE_${key
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()}. ` +
        "Firebase features will not work correctly. " +
        "See .env.example for required environment variables.",
    );
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with session-only persistence so closing the
// browser/tab immediately destroys the Firebase session.
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence).catch(console.error);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
