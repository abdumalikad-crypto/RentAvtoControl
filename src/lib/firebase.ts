// Firebase Configuration and Google Auth helper
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
} from 'firebase/auth';

// Read configuration from environment variables (.env.local) or sensible defaults
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment123456789",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ijara-avto.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ijara-avto",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ijara-avto.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Singleton Firebase App initialization
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface GoogleAuthResult {
  success: boolean;
  user?: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  error?: string;
  isSimulated?: boolean;
}

/**
 * Sign in using Firebase Google popup
 * Automatically detects whether real credentials exist or provides fallback demo
 */
export async function signInWithGooglePopup(customAccount?: { name?: string; email?: string }): Promise<GoogleAuthResult> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const isRealConfig = apiKey && !apiKey.includes('DummyKey') && apiKey.startsWith('AIzaSy');

  if (isRealConfig) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        },
      };
    } catch (err: any) {
      console.error('Firebase Google sign-in error:', err);
      // If user closed popup, return clean cancellation error
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: "Google oynasi yopildi, kirish bekor qilindi." };
      }
      return {
        success: false,
        error: err?.message || "Google orqali kirishda xatolik yuz berdi.",
      };
    }
  }

  // Graceful fallback for local development if Firebase project keys are not configured yet
  const name = customAccount?.name || 'Google Foydalanuvchisi';
  const email = customAccount?.email || 'foydalanuvchi@gmail.com';
  return {
    success: true,
    user: {
      uid: 'google-' + Math.floor(100000 + Math.random() * 900000),
      displayName: name,
      email: email,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    isSimulated: true,
  };
}

export async function signOutFromFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout warning:', err);
  }
}
