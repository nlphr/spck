// Import the necessary Firebase Authentication functions
import { createUserWithEmailAndPassword, auth } from "./firebase.js";
import { createUserWithEmailAndPassword, auth } from "./firebase.js";

// Add an event listener to the registration form
document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the email and password from the form inputs
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    // Register the user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registered successfully
        const user = userCredential.user;
        console.log("User registered:", user);
        // Redirect or update the UI as needed
        // Display success message
        document.getElementById("register-message").textContent =
          "Registration successful!";
      })
      .catch((error) => {
        // Handle errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error registering:", errorCode, errorMessage);
        // Display error message to the user
        document.getElementById(
          "register-message"
        ).textContent = `Error registering: ${errorCode} - ${errorMessage}`;
      });
  });
