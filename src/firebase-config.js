import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "yourapikey",
  authDomain: "yourdomainname",
  projectId: "yourid",
  storageBucket: "yourprojectname", // ✅ FIXED
  messagingSenderId: "yourid",
  appId: "yourid",
  measurementId: "yourid"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Added storage export
export const provider = new GoogleAuthProvider();
