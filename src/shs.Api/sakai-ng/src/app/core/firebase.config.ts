// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHjTQywmdSmdmgsrufZSLAmhi6agV0a7g",
  authDomain: "shs-oui.firebaseapp.com",
  projectId: "shs-oui",
  storageBucket: "shs-oui.firebasestorage.app",
  messagingSenderId: "619966251282",
  appId: "1:619966251282:web:df47bb6c3faa72897ef3cb",
  measurementId: "G-KEH0Z53G5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

export default app;
