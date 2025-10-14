// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6HXQ_sYvTSa_EH6oHybLAGu8XIpUojY8",
  authDomain: "gearup-fe68a.firebaseapp.com",
  databaseURL: "https://gearup-fe68a-default-rtdb.firebaseio.com/",
  projectId: "gearup-fe68a",
  storageBucket: "gearup-fe68a.firebasestorage.app",
  messagingSenderId: "112779014867",
  appId: "1:112779014867:web:95d4900eb4c8fce4c15a26",
  measurementId: "G-MFQSXY6M6Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const contactForm = document.getElementById("contactForm");
const contactsBody = document.getElementById("contactsBody");
const messageEl = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const cancelBtn = document.getElementById("cancelBtn");

// CREATE
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!firstName || !lastName || !email) return showMessage("All fields required!", "red");

  const newContactRef = db.ref("contacts").push();
  newContactRef.set({ firstName, lastName, email })
    .then(() => { showMessage("Contact added!", "green"); contactForm.reset(); })
    .catch(() => showMessage("Error adding contact!", "red"));
});

// READ
db.ref("contacts").on("value", snapshot => {
  contactsBody.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([id, contact]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.email}</td>
        <td>
          <button class="action-btn edit" data-id="${id}">Edit</button>
          <button class="action-btn delete" data-id="${id}">Delete</button>
        </td>`;
      contactsBody.appendChild(row);
    });
  } else {
    contactsBody.innerHTML = `<tr><td colspan="4">No contacts found</td></tr>`;
  }
});

// DELETE
contactsBody.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    db.ref("contacts/" + id).remove();
  }
});

// EDIT
contactsBody.addEventListener("click", e => {
  if (e.target.classList.contains("edit")) {
    const id = e.target.dataset.id;
    const row = e.target.closest("tr");
    document.getElementById("contactId").value = id;
    document.getElementById("firstName").value = row.children[0].textContent;
    document.getElementById("lastName").value = row.children[1].textContent;
    document.getElementById("email").value = row.children[2].textContent;

    saveBtn.style.display = "none";
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  }
});

// UPDATE
updateBtn.addEventListener("click", () => {
  const id = document.getElementById("contactId").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!firstName || !lastName || !email) return showMessage("All fields required!", "red");

  db.ref("contacts/" + id).update({ firstName, lastName, email })
    .then(() => { 
      showMessage("Contact updated!", "green"); 
      contactForm.reset(); 
      saveBtn.style.display = "inline-block";
      updateBtn.style.display = "none";
      cancelBtn.style.display = "none";
    })
    .catch(() => showMessage("Error updating contact!", "red"));
});

// CANCEL
cancelBtn.addEventListener("click", () => {
  contactForm.reset();
  saveBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

// Helper
function showMessage(msg, color) {
  messageEl.textContent = msg;
  messageEl.style.color = color;
  setTimeout(() => messageEl.textContent = "", 3000);
}