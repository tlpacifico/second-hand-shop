import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHjTQywmdSmdmgsrufZSLAmhi6agV0a7g",
  authDomain: "shs-oui.firebaseapp.com",
  projectId: "shs-oui",
  storageBucket: "shs-oui.firebasestorage.app",
  messagingSenderId: "619966251282",
  appId: "1:619966251282:web:ddcce0a9f15b91497ef3cb",
  measurementId: "G-7BLXCJHXMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
