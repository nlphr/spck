// Import the necessary Firebase Authentication functions
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();

// Add an event listener to the login form
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the email and password from the form inputs
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Sign in the user with Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User signed in:', user);
      // Display success message
      document.getElementById('login-message').textContent = 'Login successful!';
    })
    .catch((error) => {
      // Handle errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);
      // Display error message to the user
      document.getElementById('login-message').textContent = 'Error signing in: ' + errorMessage;
    });
}); 