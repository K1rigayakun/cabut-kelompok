const express = require("express")
const router = express.Router()
const Student = require("../models/Student")
const Slot = require("../models/Slot")

router.post("/", async (req, res) => {
  const { nim, deviceId } = req.body

  if (!/^\d+$/.test(nim)) {
    return res.status(400).json({ error: "NIM tidak valid" })
  }

  const existing = await Student.findOne({ nim })
  if (existing) {
    return res.json({ group: existing.group })
  }

  const deviceCheck = await Student.findOne({ deviceId })
  if (deviceCheck) {
    return res.status(400).json({ error: "Device sudah pernah daftar" })
  }

  const slot = await Slot.findOneAndDelete({}, { sort: { order: 1 } })

  if (!slot) {
    return res.status(400).json({ error: "Semua kelompok penuh" })
  }

  await Student.create({
    nim,
    group: slot.group,
    deviceId
  })

  res.json({ group: slot.group })
})

module.exports = router
