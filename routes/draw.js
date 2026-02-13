const express = require("express")
const router = express.Router()

const Student = require("../models/Student")
const Slot = require("../models/Slot")
const Device = require("../models/Device")

const nimRegex = /^[A-Za-z0-9]{2}1712[A-Za-z0-9]{3}$/

router.post("/", async (req, res) => {
  try {
    const { nim, deviceId } = req.body

    if (!nim || !deviceId) {
      return res.status(400).json({ error: "nim & deviceId wajib" })
    }

    if (!nimRegex.test(nim)) {
      return res.status(400).json({ error: "Format NIM salah (??1712???)" })
    }

    // nim sudah pernah -> return kelompok
    const existingStudent = await Student.findOne({ nim })
    if (existingStudent) {
      return res.json({ group: existingStudent.group, status: "existing" })
    }

    // device sudah pernah cabut -> reject
    const existingDevice = await Device.findOne({ deviceId })
    if (existingDevice) {
      return res.status(403).json({ error: "Device sudah pernah cabut" })
    }

    // ambil slot pertama yg available (atomic)
    const slot = await Slot.findOneAndUpdate(
      { taken: false },
      { taken: true },
      { sort: { order: 1 }, new: true }
    )

    if (!slot) {
      return res.status(400).json({ error: "Slot habis" })
    }

    const student = await Student.create({
      nim,
      group: slot.group
    })

    await Device.create({ deviceId, nim })

    // realtime update
    const io = req.app.get("io")
    io.emit("updateGroups")

    res.json({ group: student.group, status: "new" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// GET GROUP TABLE
router.get("/groups", async (req, res) => {
  const students = await Student.find().sort({ group: 1 }).lean()
  res.json(students)
})

module.exports = router
