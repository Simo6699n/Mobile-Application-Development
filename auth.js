import { app, db } from "./firebase-config.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const auth = getAuth(app);

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Please enter email and password");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await set(ref(db, "users/" + user.uid), {
      email,
      createdAt: new Date().toISOString(),
    });

    alert("✅ Account created successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Please enter email and password");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Logged in successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});
