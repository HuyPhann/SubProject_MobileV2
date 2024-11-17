// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import * as firebase from "firebase";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC7MRMpeSTeeUUS8l7qZEiBTqKeRl7XZXk",
//   authDomain: "fir-reactnative-55e4a.firebaseapp.com",
//   projectId: "fir-reactnative-55e4a",
//   storageBucket: "fir-reactnative-55e4a.firebasestorage.app",
//   messagingSenderId: "148871610552",
//   appId: "1:148871610552:web:edf94be0a7dfedfe98f44d",
//   measurementId: "G-Z0PKF8R6D6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export const firebaseApp = firebase.initializeApp(firebaseConfig);
// Import the required functions from Firebase SDK v9+
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For Authentication
import { getAnalytics } from "firebase/analytics"; // Optional if you use Analytics

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7MRMpeSTeeUUS8l7qZEiBTqKeRl7XZXk",
  authDomain: "fir-reactnative-55e4a.firebaseapp.com",
  projectId: "fir-reactnative-55e4a",
  storageBucket: "fir-reactnative-55e4a.appspot.com",
  messagingSenderId: "148871610552",
  appId: "1:148871610552:web:edf94be0a7dfedfe98f44d",
  measurementId: "G-Z0PKF8R6D6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional
const auth = getAuth(app); // Firebase Authentication

export { app, auth };
