// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBREyR9wCFNlQ1XZUY7BjaoaDQrNZiPG1c",
  authDomain: "hiperlife-8a812.firebaseapp.com",
  projectId: "hiperlife-8a812",
  storageBucket: "hiperlife-8a812.appspot.com",
  messagingSenderId: "285758131157",
  appId: "1:285758131157:web:4193388cd05ea771398b5c",
  measurementId: "G-ZV0Y50WCG9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Auth by firebase
export const auth = getAuth(app);
