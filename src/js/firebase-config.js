import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWZWmD3CUwhlQ1rPC0zAYiFjW0jZX1lF8",
  authDomain: "pcpart-service.firebaseapp.com",
  projectId: "pcpart-service",
  storageBucket: "pcpart-service.firebasestorage.app",
  messagingSenderId: "607350512305",
  appId: "1:607350512305:web:b47f26ccf3a405c3856090",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
// const storage = firebase.storage();
export { db };
