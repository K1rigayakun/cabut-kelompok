const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const Slot = require("../models/Slot")
const Student = require("../models/Student")
const Device = require("../models/Device")
const Settings = require("../models/Settings")
const shuffleCrypto = require("../utils/shuffleCrypto")

const authAdmin = require("../middleware/authAdmin")

// LOGIN ADMIN
router.post("/login", (req, res) => {
  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Password salah" })
  }

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
    expiresIn: "2h"
  })

  res.json({ token })
})

// GET SETTINGS
router.get("/settings", authAdmin, async (req, res) => {
  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({ groups: 7, maxPerGroup: 6 })

  res.json(settings)
})

// UPDATE SETTINGS + REINIT SLOT
router.post("/settings", authAdmin, async (req, res) => {
  const { groups, maxPerGroup } = req.body

  if (groups < 1 || maxPerGroup < 1) {
    return res.status(400).json({ error: "Invalid settings" })
  }

  let settings = await Settings.findOne()
  if (!settings) settings = new Settings()

  settings.groups = groups
  settings.maxPerGroup = maxPerGroup
  await settings.save()

  // regen slot
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

  res.json({ message: "Settings updated & slots regenerated" })
})

// RESET ALL
router.post("/reset", authAdmin, async (req, res) => {
  await Student.deleteMany()
  await Slot.deleteMany()
  await Device.deleteMany()

  res.json({ message: "All data reset" })
})

module.exports = router
