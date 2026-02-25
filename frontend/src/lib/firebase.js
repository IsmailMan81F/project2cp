// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYb6YBEpi8uJazvC0K7l0Jyc-Cs8ti_mE",
  authDomain: "project2cp-website-dce45.firebaseapp.com",
  projectId: "project2cp-website-dce45",
  storageBucket: "project2cp-website-dce45.firebasestorage.app",
  messagingSenderId: "155670773068",
  appId: "1:155670773068:web:bdd65304c003a6931e23e9",
  measurementId: "G-6MJQS7E6KE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);