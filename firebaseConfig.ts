// firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    // Handle the result, e.g., get the user info
    const token = await result.user.getIdToken()
    // Store the token securely
  } catch (error) {
    console.error("Error signing in with Google:", error)
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Storage
const storage = getStorage(app)
const db = getFirestore(app) // Initialize Firestore
const auth = getAuth(app)

export { auth, db, GoogleAuthProvider, signInWithPopup, storage }