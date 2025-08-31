import { auth, createUserWithEmailAndPassword } from "../firebase.js";

const userListElement = document.getElementById("user-list");
const newUserEmailInput = document.getElementById("new-user-email");
const newUserPasswordInput = document.getElementById("new-user-password");
const createUserBtn = document.getElementById("create-user-btn");
const deleteUserEmailInput = document.getElementById("delete-user-email");
const confirmDeleteUserBtn = document.getElementById("confirm-delete-user-btn");

// Function to fetch and display users (client-side simulation, ideally from backend)
async function fetchAndDisplayUsers() {
  // In a real application, you would make an authenticated request to your backend
  // which uses Firebase Admin SDK to list users.
  // For this client-side example, we'll just show a placeholder.
  userListElement.innerHTML = "<li class=\"list-group-item\">Loading users (requires backend for real data)...</li>";

  // Simulate fetching data (replace with actual backend call)
  const simulatedUsers = [
    { email: "user1@example.com" },
    { email: "user2@example.com" },
  ];

  setTimeout(() => {
    userListElement.innerHTML = "";
    if (simulatedUsers.length === 0) {
      userListElement.innerHTML = "<li class=\"list-group-item\">No users found.</li>";
    } else {
      simulatedUsers.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `Email: ${user.email}`;
        userListElement.appendChild(listItem);
      });
    }
  }, 1000);
}

// Function to add a new user
createUserBtn.addEventListener("click", async () => {
  const email = newUserEmailInput.value;
  const password = newUserPasswordInput.value;

  if (email && password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User added successfully:", userCredential.user);
      alert(`User ${email} added successfully!`);
      newUserEmailInput.value = "";
      newUserPasswordInput.value = "";
      fetchAndDisplayUsers(); // Refresh the list
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert(`Error adding user: ${error.message}`);
    }
  } else {
    alert("Please enter both email and password.");
  }
});

// Function to delete a user (client-side simulation, ideally from backend)
confirmDeleteUserBtn.addEventListener("click", async () => {
  const emailToDelete = deleteUserEmailInput.value;

  if (emailToDelete) {
    // In a real application, you would send this email to your backend
    // which uses Firebase Admin SDK to delete the user.
    // For this client-side example, we'll just simulate it.
    console.log(`Attempting to delete user with email: ${emailToDelete}`);
    alert(`User deletion for ${emailToDelete} simulated. (Requires backend for actual deletion)`);
    deleteUserEmailInput.value = "";
    fetchAndDisplayUsers(); // Refresh the list
  } else {
    alert("Please enter the email of the user to delete.");
  }
});

// Initial fetch when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
