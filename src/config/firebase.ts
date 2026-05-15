import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Fill in your Firebase project values in .env (see .env.example)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'PLACEHOLDER',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'PLACEHOLDER',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'PLACEHOLDER',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'PLACEHOLDER',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? 'PLACEHOLDER',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? 'PLACEHOLDER',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use AsyncStorage persistence so auth survives app restarts
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
