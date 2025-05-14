import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyC2i49gavioG_h0UZYxvQLcM4aEY0kv2go",
  authDomain: "blogapp-3fbe5.firebaseapp.com",
  projectId: "blogapp-3fbe5",
  storageBucket: "blogapp-3fbe5.appspot.com", // ✅ FIXED
  messagingSenderId: "425480194955",
  appId: "1:425480194955:web:eff2b300c6fd4ef035bd8e",
  measurementId: "G-E7FPSCN63X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Added storage export
export const provider = new GoogleAuthProvider();
