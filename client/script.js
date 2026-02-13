const API_URL = "https://cabut-kelompok.onrender.com" // GANTI INI

function getDeviceId() {
  let id = localStorage.getItem("deviceId")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("deviceId", id)
  }
  return id
}

async function loadGroups() {
  const res = await fetch(API_URL + "/draw/groups")
  const data = await res.json()

  let html = "<table><tr><th>NIM</th><th>Kelompok</th></tr>"
  data.forEach(s => {
    html += `<tr><td>${s.nim}</td><td>${s.group}</td></tr>`
  })
  html += "</table>"

  document.getElementById("groupsTable").innerHTML = html
}

// realtime socket
const socket = io(API_URL)

socket.on("connect", () => {
  console.log("Socket connected:", socket.id)
})

socket.on("updateGroups", () => {
  loadGroups()
})

document.getElementById("btnDraw").addEventListener("click", async () => {
  const nim = document.getElementById("nim").value.trim()
  const deviceId = getDeviceId()

  const resultBox = document.getElementById("result")
  resultBox.classList.remove("hidden")
  resultBox.innerText = "Mengacak nomor..."

  try {
    const res = await fetch(API_URL + "/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, deviceId })
    })

    const data = await res.json()

    if (!res.ok) {
      resultBox.innerText = "❌ " + data.error
      return
    }

    resultBox.innerText = `✅ ${nim} masuk Kelompok ${data.group}`
  } catch (err) {
    resultBox.innerText = "⏳ Server lagi bangun (Render sleep), coba lagi..."
  }
})

loadGroups()
