
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For Authentication
import { getAnalytics } from "firebase/analytics"; // Optional if you use Analytics
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7MRMpeSTeeUUS8l7qZEiBTqKeRl7XZXk",
  authDomain: "fir-reactnative-55e4a.firebaseapp.com",
  projectId: "fir-reactnative-55e4a",
  storageBucket: "fir-reactnative-55e4a.firebasestorage.app",
  messagingSenderId: "148871610552",
  appId: "1:148871610552:web:edf94be0a7dfedfe98f44d",
  measurementId: "G-Z0PKF8R6D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app);
console.log("Firestore DB initialized:", db);
export { app, auth, db };
