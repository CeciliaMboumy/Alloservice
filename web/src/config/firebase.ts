import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Copy your Firebase config from https://console.firebase.google.com
// Project settings → Your apps → Web app → Config
// Then create web/.env.local with these values:
//
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'PLACEHOLDER',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'PLACEHOLDER',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'PLACEHOLDER',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'PLACEHOLDER',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? 'PLACEHOLDER',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? 'PLACEHOLDER',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Standard web auth — browser handles persistence automatically (no AsyncStorage needed)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
