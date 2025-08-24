import { signInUser, signInWithGoogle } from './firebase.js';

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInUser(email, password)
    .then(() => {
      console.log('User signed in.');
      document.getElementById('login-message').textContent = 'Login successful!';
      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error('Error signing in:', error.code, errorMessage);
      document.getElementById('login-message').textContent = `Error signing in: ${error.code} - ${errorMessage}`;
    });
});

document.getElementById('google-login-button').addEventListener('click', function() {
  signInWithGoogle()
    .then(() => {
      console.log('Google user signed in.');
      document.getElementById('login-message').textContent = 'Google login successful!';
      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error('Error with Google sign-in:', error.code, errorMessage);
      document.getElementById('login-message').textContent = `Error with Google sign-in: ${error.code} - ${errorMessage}`;
    });
}); 