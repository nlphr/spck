// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";
import { firebaseConfig } from "./firebase-config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Example function to sign in a user
function signInUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('User signed in:', user);
      return user; // Return user credential for chaining
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);
      throw error; // Re-throw the error for the calling function to catch
    });
}
 
// Function to sign in with Google
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log('Google user signed in:', user);
      return user; // Return user credential for chaining
      // IdP data available in result.additionalUserInfo.profile
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Error with Google sign-in:', errorCode, errorMessage);
      throw error; // Re-throw the error for the calling function to catch
      // ...
    });
}

function signOutUser() {
  return auth.signOut();
}

export { signInUser, signInWithGoogle, createUserWithEmailAndPassword, auth, analytics, signOutUser, functions }; 
