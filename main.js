import { addData, readData } from "./firebase-config.js";

// ----------------- 1. Screen navigation -----------------
const screens = ['home', 'navigation', 'safety', 'maintenance', 'documents'];

function navTo(id) {
  screens.forEach(s => {
    const el = document.getElementById(s);
    el.classList.remove('active');
    if (s === id) el.classList.add('active');
  });

  // Highlight active nav button
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  const idx = screens.indexOf(id);
  if (idx >= 0) document.querySelectorAll('nav button')[idx].classList.add('active');
}

window.navTo = navTo;

// ----------------- 2. Ride buttons -----------------
document.getElementById('saveRide')?.addEventListener('click', async () => {
  const rideData = {
    destination: "Patan",
    distance: "3.2 km",
    time: new Date().toLocaleString()
  };
  await addData('rides/latest', rideData);
  alert("✅ Ride saved successfully!");
});

document.getElementById('readRide')?.addEventListener('click', async () => {
  const ride = await readData('rides/latest');
  if (ride) alert(`📍 Last Ride: ${ride.destination}, ${ride.distance}`);
  else alert('No ride data found.');
});

// ----------------- 3. Fake map moving dot -----------------
const map = document.getElementById("map");

function simulateMovement() {
  if (!map) return;
  let x = Math.random() * 80 + 10; // random X
  let y = Math.random() * 80 + 10; // random Y

  const pin = document.createElement("div");
  pin.style.position = "absolute";
  pin.style.width = "16px";
  pin.style.height = "16px";
  pin.style.background = "red";
  pin.style.borderRadius = "50%";
  pin.style.left = x + "%";
  pin.style.top = y + "%";
  pin.style.transition = "all 0.5s ease";

  map.appendChild(pin);
  setTimeout(() => map.removeChild(pin), 1000);
}

// Start fake map animation
setInterval(simulateMovement, 1000);

// ----------------- 4. Emergency SOS Feature -----------------
const sosBtn = document.getElementById('sosBtn');

sosBtn?.addEventListener('click', async () => {
  // Try to get GPS location
  let location = "Unknown";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        saveSOS(location);
      },
      () => {
        saveSOS(location);
      }
    );
  } else {
    saveSOS(location);
  }
});

async function saveSOS(location) {
  const sosData = {
    time: new Date().toLocaleString(),
    location,
    status: "active"
  };
  await addData('sos/active', sosData);

  alert("📞 Calling the nearest ambulance...");
  setTimeout(() => alert("🚨 Police station notified!"), 1000);
  setTimeout(() => alert("📱 Your friend has been informed!"), 2000);

  setTimeout(() => {
    window.location.href = "tel:102"; // Ambulance number (Nepal)
  }, 3000);

  const btn = document.getElementById('sosBtn');
  btn.innerText = "SOS Sent 🚨";
  btn.disabled = true;
}

// ----------------- 5. Document Upload Feature -----------------
const licenseInput = document.getElementById('licenseUpload');
const bluebookInput = document.getElementById('bluebookUpload');
const licensePreview = document.getElementById('licensePreview');
const bluebookPreview = document.getElementById('bluebookPreview');

licenseInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    licensePreview.innerHTML = `<b>License Uploaded:</b><br><img src="${reader.result}" alt="License Preview">`;
  };
  reader.readAsDataURL(file);
});

bluebookInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    bluebookPreview.innerHTML = `<b>Bluebook Uploaded:</b><br><img src="${reader.result}" alt="Bluebook Preview">`;
  };
  reader.readAsDataURL(file);
});

// ----------------- 6. Emergency Center Call Buttons -----------------
async function logEmergencyCall(serviceName, phoneNumber) {
  const data = {
    service: serviceName,
    number: phoneNumber,
    time: new Date().toLocaleString(),
  };

  // Save call log in Firebase Realtime DB
  await addData(`emergency_calls/${serviceName}`, data);

  alert(`📞 Calling ${serviceName} (${phoneNumber})...`);

  // Small delay before triggering call
  setTimeout(() => {
    window.location.href = `tel:${phoneNumber}`;
  }, 1500);
}

// Button Event Listeners
document.getElementById('callPolice')?.addEventListener('click', () => {
  logEmergencyCall("Police", "100");
});

document.getElementById('callAmbulance')?.addEventListener('click', () => {
  logEmergencyCall("Ambulance", "102");
});

document.getElementById('callFire')?.addEventListener('click', () => {
  logEmergencyCall("Fire Brigade", "101");
});

document.getElementById('callHospital')?.addEventListener('click', () => {
  logEmergencyCall("Hospital", "014410007"); // Example hospital in KTM
});

document.getElementById('callWomenHelpline')?.addEventListener('click', () => {
  logEmergencyCall("Women Helpline", "1145");
});

document.getElementById('callChildHelpline')?.addEventListener('click', () => {
  logEmergencyCall("Child Helpline", "1098");
});

// ----------------- 7. Ride Simulation Animation -----------------
const startRideBtn = document.getElementById('startRideBtn');
const rideMap = document.getElementById('rideMap');
const bikeIcon = document.getElementById('bikeIcon');
const rideStatus = document.getElementById('rideStatus');

startRideBtn?.addEventListener('click', () => {
  rideMap.classList.remove('hidden');
  rideStatus.textContent = "🏁 Ready to go!";
  startRideBtn.disabled = true;
  startRideBtn.innerText = "Riding...";

  // Animate bike movement
  let position = 10;
  const rideInterval = setInterval(() => {
    position += 2;
    bikeIcon.style.left = position + "%";

    if (position > 85) {
      clearInterval(rideInterval);
      rideStatus.textContent = "✅ Ride Completed!";
      startRideBtn.innerText = "Start Ride";
      startRideBtn.disabled = false;
    } else if (position > 12) {
      rideStatus.textContent = "🏍️ Riding...";
    }
  }, 300);
});
