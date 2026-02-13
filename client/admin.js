const API_URL = "https://cabut-kelompok.onrender.com" // ganti

function showMsg(msg) {
  const box = document.getElementById("adminMsg")
  box.classList.remove("hidden")
  box.innerText = msg
}

document.getElementById("btnLogin").addEventListener("click", async () => {
  const password = document.getElementById("password").value.trim()

  const res = await fetch(API_URL + "/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })

  const data = await res.json()

  if (!res.ok) {
    showMsg("❌ " + data.error)
    return
  }

  localStorage.setItem("adminToken", data.token)

  document.getElementById("loginBox").classList.add("hidden")
  document.getElementById("adminBox").classList.remove("hidden")

  showMsg("✅ Login sukses")

  loadSettings()
})

async function loadSettings() {
  const token = localStorage.getItem("adminToken")

  const res = await fetch(API_URL + "/admin/settings", {
    headers: { Authorization: "Bearer " + token }
  })

  const data = await res.json()

  document.getElementById("groups").value = data.groups
  document.getElementById("maxPerGroup").value = data.maxPerGroup
}

document.getElementById("btnSave").addEventListener("click", async () => {
  const token = localStorage.getItem("adminToken")

  const groups = parseInt(document.getElementById("groups").value)
  const maxPerGroup = parseInt(document.getElementById("maxPerGroup").value)

  const res = await fetch(API_URL + "/admin/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ groups, maxPerGroup })
  })

  const data = await res.json()

  if (!res.ok) {
    showMsg("❌ " + data.error)
    return
  }

  showMsg("✅ Slot berhasil digenerate ulang!")
})

document.getElementById("btnReset").addEventListener("click", async () => {
  if (!confirm("Yakin reset semua data?")) return

  const token = localStorage.getItem("adminToken")

  const res = await fetch(API_URL + "/admin/reset", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    }
  })

  const data = await res.json()

  if (!res.ok) {
    showMsg("❌ " + data.error)
    return
  }

  showMsg("🗑 Semua data berhasil direset")
})
