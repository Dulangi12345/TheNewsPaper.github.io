// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
import { get } from "mongoose";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBddjlYBbn3bHLZAurWSQuV6EkzG-Pc_Is",
  authDomain: "the-newspaper-748a6.firebaseapp.com",
  projectId: "the-newspaper-748a6",
  storageBucket: "the-newspaper-748a6.appspot.com",
  messagingSenderId: "1010749923472",
  appId: "1:1010749923472:web:a9445a6e8541100c69f815",
  measurementId: "G-3THEMCRRP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export default app;
export {db, auth , storage};


