const API_URL = "http://localhost:3000"; // nanti diganti pas hosting

// bikin deviceId unik (disimpan supaya device ga bisa daftar ulang)
function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device-" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

const drawBtn = document.getElementById("drawBtn");
const nimInput = document.getElementById("nimInput");
const resultText = document.getElementById("resultText");
const errorText = document.getElementById("errorText");
const groupTable = document.getElementById("groupTable");

// ambil data kelompok dari backend (kita buat endpointnya nanti)
async function fetchGroups() {
  const res = await fetch(`${API_URL}/groups`);
  const data = await res.json();
  renderGroups(data);
}

function renderGroups(groups) {
  groupTable.innerHTML = "";

  for (let i = 1; i <= 7; i++) {
    const members = groups[i] || [];

    const card = document.createElement("div");
    card.className = "border rounded-lg p-4 bg-gray-50";

    card.innerHTML = `
      <h3 class="font-bold text-lg mb-2">Kelompok ${i}</h3>
      <ul class="text-sm space-y-1">
        ${members.length === 0 ? "<li class='text-gray-400'>Belum ada anggota</li>" :
          members.map(m => `<li>• ${m}</li>`).join("")
        }
      </ul>
      <p class="mt-2 text-xs text-gray-500">(${members.length}/6 anggota)</p>
    `;

    groupTable.appendChild(card);
  }
}

// event cabut nomor
drawBtn.addEventListener("click", async () => {
  errorText.textContent = "";
  resultText.textContent = "";

  const nim = nimInput.value.trim();
  if (!nim) {
    errorText.textContent = "Masukkan NIM dulu!";
    return;
  }

  try {
    drawBtn.disabled = true;
    drawBtn.textContent = "Mengacak...";

    const res = await fetch(`${API_URL}/draw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nim,
        deviceId: getDeviceId()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.error || "Terjadi error";
      return;
    }

    resultText.textContent = `🎉 Kamu masuk Kelompok ${data.group}!`;
    fetchGroups();

  } catch (err) {
    errorText.textContent = "Server tidak bisa diakses!";
  } finally {
    drawBtn.disabled = false;
    drawBtn.textContent = "Cabut Nomor";
  }
});

// refresh tabel realtime tiap 3 detik
setInterval(fetchGroups, 3000);

// load awal
fetchGroups();
