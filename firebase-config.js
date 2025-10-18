// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJzfy-SnBFuauD-xhenWM-zKDmyQLi0EY",
  authDomain: "gearup-bb627.firebaseapp.com",
  databaseURL: "https://gearup-bb627-default-rtdb.firebaseio.com",
  projectId: "gearup-bb627",
  storageBucket: "gearup-bb627.firebasestorage.app",
  messagingSenderId: "178957736215",
  appId: "1:178957736215:web:53c292fb56517591c0bf52",
  measurementId: "G-1EE00RJ3FZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);

// CRUD functions
export async function addData(path, data) {
  await set(ref(db, path), data);
}

export async function readData(path) {
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function updateData(path, data) {
  await update(ref(db, path), data);
}

export async function deleteData(path) {
  await remove(ref(db, path));
}
