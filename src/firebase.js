import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjQ_4JI4_WcPhvdB9HTLFAO3O5qj3dlg4",
  authDomain: "qyrova-auth.firebaseapp.com",
  projectId: "qyrova-auth",
  storageBucket: "qyrova-auth.firebasestorage.app",
  messagingSenderId: "702222599424",
  appId: "1:702222599424:web:46a8b822709a0471925fe5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);