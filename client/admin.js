const API_URL = "https://cabut-kelompok.onrender.com" // GANTI INI

function showMsg(msg) {
  const box = document.getElementById("adminMsg")
  box.classList.remove("hidden")
  box.innerText = msg
}

async function loadSettings() {
  const token = localStorage.getItem("adminToken")

  const res = await fetch(API_URL + "/admin/settings", {
    headers: { Authorization: "Bearer " + token }
  })

  const data = await res.json()

  if (!res.ok) {
    showMsg("❌ Token invalid, login ulang")
    localStorage.removeItem("adminToken")
    return
  }

  document.getElementById("groups").value = data.groups
  document.getElementById("maxPerGroup").value = data.maxPerGroup

  // export link
  document.getElementById("btnExport").href =
    API_URL + "/admin/export"
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

  showMsg("✅ " + data.message)
})

document.getElementById("btnReset").addEventListener("click", async () => {
  if (!confirm("Yakin reset semua data?")) return

  const token = localStorage.getItem("adminToken")

  const res = await fetch(API_URL + "/admin/reset", {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  })

  const data = await res.json()

  if (!res.ok) {
    showMsg("❌ " + data.error)
    return
  }

  showMsg("🗑 " + data.message)
})

// auto detect token
if (localStorage.getItem("adminToken")) {
  document.getElementById("loginBox").classList.add("hidden")
  document.getElementById("adminBox").classList.remove("hidden")
  loadSettings()
}
