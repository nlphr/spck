import { auth, signOutUser } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const userEmailSpan = document.getElementById('user-email');
const logoutLink = document.getElementById('logout-link');

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userEmailSpan.textContent = user.email;
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    userEmailSpan.style.display = 'inline';
    logoutLink.style.display = 'inline';
  } else {
    // User is signed out
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    userEmailSpan.style.display = 'none';
    logoutLink.style.display = 'none';
  }
});

logoutLink.addEventListener('click', (event) => {
  event.preventDefault();
  signOutUser().then(() => {
    console.log('User signed out.');
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});
