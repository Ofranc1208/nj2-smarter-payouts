import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration using static config values
const firebaseConfig = {
  apiKey: "AIzaSyDlJPUZ8u2PPKQeVuNWmDnmfKtSVFJ-m2E",
  authDomain: "smarter-payouts.firebaseapp.com",
  projectId: "smarter-payouts",
  storageBucket: "smarter-payouts.firebasestorage.app",
  messagingSenderId: "870646148634",
  appId: "1:870646148634:web:92faf9c279fed8f9c66ba3",
  measurementId: "G-YT1PCCHLKR"
};

// ✅ Initialize app once
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase initialized');
}

// Dynamic import helper for Firebase (for tree-shaking and reduced initial JS)
export async function loadFirebase() {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, RecaptchaVerifier } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');
  const { getStorage } = await import('firebase/storage');
  const app = initializeApp(firebaseConfig);
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
    RecaptchaVerifier,
  };
}

export { auth, db, storage, RecaptchaVerifier }; 
// Triggering redeploy
