const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const ExcelJS = require("exceljs")

const Slot = require("../models/Slot")
const Student = require("../models/Student")
const Device = require("../models/Device")
const Settings = require("../models/Settings")

const shuffleCrypto = require("../utils/shuffleCrypto")
const authAdmin = require("../middleware/authAdmin")

// ADMIN LOGIN
router.post("/login", (req, res) => {
  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Password salah" })
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
    expiresIn: "3h"
  })

  res.json({ token })
})

// GET SETTINGS
router.get("/settings", authAdmin, async (req, res) => {
  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({ groups: 7, maxPerGroup: 6 })
  res.json(settings)
})

// UPDATE SETTINGS + REGENERATE SLOT
router.post("/settings", authAdmin, async (req, res) => {
  const { groups, maxPerGroup } = req.body

  if (!groups || !maxPerGroup) {
    return res.status(400).json({ error: "groups & maxPerGroup wajib" })
  }

  if (groups < 1 || maxPerGroup < 1) {
    return res.status(400).json({ error: "settings invalid" })
  }

  let settings = await Settings.findOne()
  if (!settings) settings = new Settings()

  settings.groups = groups
  settings.maxPerGroup = maxPerGroup
  await settings.save()

  await Slot.deleteMany()

  let slots = []
  for (let i = 1; i <= groups; i++) {
    for (let j = 0; j < maxPerGroup; j++) {
      slots.push(i)
    }
  }

  shuffleCrypto(slots)

  const data = slots.map((g, idx) => ({
    order: idx,
    group: g,
    taken: false
  }))

  await Slot.insertMany(data)

  const io = req.app.get("io")
  io.emit("updateGroups")

  res.json({ message: "Settings updated & slot regenerated" })
})

// RESET ALL DATA
router.post("/reset", authAdmin, async (req, res) => {
  await Student.deleteMany()
  await Slot.deleteMany()
  await Device.deleteMany()

  const io = req.app.get("io")
  io.emit("updateGroups")

  res.json({ message: "All data reset" })
})

// EXPORT EXCEL
router.get("/export", authAdmin, async (req, res) => {
  const students = await Student.find().sort({ group: 1 }).lean()

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Kelompok")

  sheet.columns = [
    { header: "NIM", key: "nim", width: 20 },
    { header: "Kelompok", key: "group", width: 10 }
  ]

  students.forEach(s => {
    sheet.addRow({ nim: s.nim, group: s.group })
  })

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )

  res.setHeader("Content-Disposition", "attachment; filename=kelompok.xlsx")

  await workbook.xlsx.write(res)
  res.end()
})

module.exports = router
