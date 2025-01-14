// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT_CQ7Pal-_q13SsZW5j75wVD6f3JBfmA",
  authDomain: "waffecollege-cinrastyle-outfit.firebaseapp.com",
  projectId: "waffecollege-cinrastyle-outfit",
  storageBucket: "waffecollege-cinrastyle-outfit.firebasestorage.app",
  messagingSenderId: "739603010894",
  appId: "1:739603010894:web:331d193bbe740e42bc3a1f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };
