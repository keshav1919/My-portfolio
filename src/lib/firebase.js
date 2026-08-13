import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLBRWEdMWbZpn4dt92gGNVVkhMaA_GmUs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "keshavcoder-web.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "keshavcoder-web",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "keshavcoder-web.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "513709886481",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:513709886481:web:7239d102b3af02603df5b0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GW9RZ0SD1X"
};

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable local persistence so user stays logged in across refreshes and tabs
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Persistence initialization notice:', err.message);
});

export { app, auth, db };
