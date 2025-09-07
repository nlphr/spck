const firebaseConfig = {
  apiKey: "AIzaSyAWZWmD3CUwhlQ1rPC0zAYiFjW0jZX1lF8",
  authDomain: "pcpart-service.firebaseapp.com",
  projectId: "pcpart-service",
  storageBucket: "pcpart-service.firebasestorage.app",
  messagingSenderId: "607350512305",
  appId: "1:607350512305:web:b47f26ccf3a405c3856090",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// Check if auth is available before initializing
let auth = null;
if (firebase.auth) {
  auth = firebase.auth();
}

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();


