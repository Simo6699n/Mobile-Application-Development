import { getAuth, onAuthStateChanged, deleteUser, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { ref, set, get, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { db } from "./firebase-config.js";

const auth = getAuth();
const displayNameInput = document.getElementById("displayName");
const userEmailSpan = document.getElementById("userEmail");
const userUIDSpan = document.getElementById("userUID");
const profilePic = document.getElementById("profilePic");
const saveBtn = document.getElementById("saveProfile");
const logoutBtn = document.getElementById("logoutBtn");
const deleteBtn = document.getElementById("deleteBtn");
const photoUpload = document.getElementById("photoUpload");

let currentUser = null;

// Load current user info
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userEmailSpan.textContent = user.email;
    userUIDSpan.textContent = user.uid;

    // Load extra data from Realtime Database
    const snapshot = await get(ref(db, "users/" + user.uid));
    const data = snapshot.exists() ? snapshot.val() : {};

    if (data.displayName) displayNameInput.value = data.displayName;
    if (data.photoURL) profilePic.src = data.photoURL;
  } else {
    window.location.href = "welcome.html";
  }
});

// Upload new photo preview
photoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    profilePic.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Save profile data
saveBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  const newName = displayNameInput.value.trim();
  const newPhoto = profilePic.src;

  // Update Firebase Auth profile
  await updateProfile(currentUser, {
    displayName: newName || currentUser.displayName,
    photoURL: newPhoto || currentUser.photoURL,
  });

  // Save to Realtime Database
  await set(ref(db, "users/" + currentUser.uid), {
    email: currentUser.email,
    displayName: newName,
    photoURL: newPhoto,
    updatedAt: new Date().toISOString(),
  });

  alert("✅ Profile updated successfully!");
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  alert("👋 Logged out successfully!");
  window.location.href = "welcome.html";
});

// Delete account
deleteBtn.addEventListener("click", async () => {
  const confirmDelete = confirm("⚠️ Are you sure you want to delete your account?");
  if (!confirmDelete) return;

  try {
    await remove(ref(db, "users/" + currentUser.uid));
    await deleteUser(currentUser);
    alert("🗑️ Account deleted!");
    window.location.href = "welcome.html";
  } catch (err) {
    alert("❌ Error deleting account: " + err.message);
  }
});
