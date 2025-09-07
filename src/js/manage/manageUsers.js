import { auth, createUserWithEmailAndPassword } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const userListElement = document.getElementById("user-list");
const newUserEmailInput = document.getElementById("new-user-email");
const newUserPasswordInput = document.getElementById("new-user-password");
const createUserBtn = document.getElementById("create-user-btn");
const deleteUserUidInput = document.getElementById("delete-user-uid");
const confirmDeleteUserBtn = document.getElementById("confirm-delete-user-btn");
const adminMessageDiv = document.getElementById("admin-message");

const addNewUserSection = document.querySelector(".mt-4:nth-of-type(3)"); // Select the 'Add New User' section
const deleteUserSection = document.querySelector(".mt-4:nth-of-type(4)"); // Select the 'Delete User' section

const ADMIN_EMAIL = "admin123@gmail.com";

const functions = getFunctions();
const listUsersCallable = httpsCallable(functions, 'listUsers');
const deleteUserByUidCallable = httpsCallable(functions, 'deleteUserByUid');

function showMessage(message, type) {
  adminMessageDiv.textContent = message;
  adminMessageDiv.className = `alert alert-${type}`;
  adminMessageDiv.style.display = 'block';
}

function hideMessage() {
  adminMessageDiv.style.display = 'none';
}

onAuthStateChanged(auth, (user) => {
  if (user && user.email === ADMIN_EMAIL) {
    // Admin is logged in
    addNewUserSection.style.display = 'block';
    deleteUserSection.style.display = 'block';
    showMessage("Admin logged in. You have full user management access.", "success");
  } else {
    // Non-admin or logged out
    addNewUserSection.style.display = 'none';
    deleteUserSection.style.display = 'none';
    showMessage("You must be logged in as an administrator to manage users.", "danger");
  }
  fetchAndDisplayUsers(); // Always try to fetch users, but controls will be hidden for non-admins
});

// Function to fetch and display users (now calling backend)
async function fetchAndDisplayUsers() {
  userListElement.innerHTML = "<li class=\"list-group-item\">Fetching users...</li>";
  try {
    const result = await listUsersCallable();
    const users = result.data.users;

    userListElement.innerHTML = "";
    if (users.length === 0) {
      userListElement.innerHTML = "<li class=\"list-group-item\">No users found.</li>";
    } else {
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `Email: ${user.email} (UID: ${user.uid})`;
        userListElement.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);
    userListElement.innerHTML = '<li class="list-group-item text-danger">Error loading users: Ensure Cloud Functions are deployed and accessible.</li>';
  }
}

// Function to add a new user
createUserBtn.addEventListener("click", async () => {
  hideMessage();
  const email = newUserEmailInput.value;
  const password = newUserPasswordInput.value;

  if (email && password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User added successfully:", userCredential.user);
      showMessage(`User ${email} added successfully! UID: ${userCredential.user.uid}`, "success");
      newUserEmailInput.value = "";
      newUserPasswordInput.value = "";
      fetchAndDisplayUsers(); // Refresh the list
    } catch (error) {
      console.error("Error adding user:", error.message);
      showMessage(`Error adding user: ${error.message}`, "danger");
    }
  } else {
    showMessage("Please enter both email and password.", "warning");
  }
});

// Function to delete a user (now calling backend)
confirmDeleteUserBtn.addEventListener("click", async () => {
  hideMessage();
  const uidToDelete = deleteUserUidInput.value;

  if (uidToDelete) {
    try {
      const result = await deleteUserByUidCallable({ uid: uidToDelete });
      console.log("User deleted successfully:", result.data.message);
      showMessage(`User with UID: ${uidToDelete} deleted successfully!`, "success");
      deleteUserUidInput.value = "";
      fetchAndDisplayUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error.message);
      showMessage(`Error deleting user: ${error.message}. Ensure Cloud Functions are deployed and accessible.`, "danger");
    }
  } else {
    showMessage("Please enter the UID of the user to delete.", "warning");
  }
});

// Initial fetch when the page loads (now handled by onAuthStateChanged callback)
// document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
