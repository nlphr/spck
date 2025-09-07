const firebaseConfig = {
  apiKey: "AIzaSyAWZWmD3CUwhlQ1rPC0zAYiFjW0jZX1lF8",
  authDomain: "pcpart-service.firebaseapp.com",
  projectId: "pcpart-service",
  storageBucket: "pcpart-service.firebasestorage.app",
  messagingSenderId: "607350512305",
  appId: "1:607350512305:web:b47f26ccf3a405c3856090",
};

<<<<<<< HEAD
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
<<<<<<< HEAD
// const auth = firebase.auth();
=======
=======
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
>>>>>>> 65eb5fcb173cbb2e1c04fcfdb9ef3572f9576954
// Check if auth is available before initializing
let auth = null;
if (firebase.auth) {
  auth = firebase.auth();
}
<<<<<<< HEAD
>>>>>>> 65eb5fc (Update_css_admin)
=======
>>>>>>> 65eb5fcb173cbb2e1c04fcfdb9ef3572f9576954

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();
<<<<<<< HEAD
=======


>>>>>>> 65eb5fcb173cbb2e1c04fcfdb9ef3572f9576954
