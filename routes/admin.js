const express = require("express")
const router = express.Router()
const Slot = require("../models/Slot")
const Student = require("../models/Student")
const shuffle = require("../utils/shuffle")
const ExcelJS = require("exceljs")

// INIT SLOT (acak 7 kelompok x 6 slot = 42)
router.get("/init", async (req, res) => {
  try {
    await Slot.deleteMany()

    let slots = []

    for (let i = 1; i <= 7; i++) {
      for (let j = 0; j < 6; j++) {
        slots.push(i)
      }
    }

    shuffle(slots)

    const data = slots.map((group, index) => ({
      order: index,
      group: group
    }))

    await Slot.insertMany(data)

    res.json({ message: "Slots initialized" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Init failed" })
  }
})

// RESET
router.post("/reset", async (req, res) => {
  try {
    await Student.deleteMany()
    await Slot.deleteMany()
    res.json({ message: "System reset" })
  } catch (err) {
    res.status(500).json({ error: "Reset failed" })
  }
})

// EXPORT EXCEL
router.get("/export", async (req, res) => {
  try {
    const students = await Student.find().sort({ group: 1 })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Kelompok")

    sheet.columns = [
      { header: "NIM", key: "nim" },
      { header: "Kelompok", key: "group" }
    ]

    students.forEach(s => {
      sheet.addRow({
        nim: s.nim,
        group: s.group
      })
    })

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    res.status(500).json({ error: "Export failed" })
  }
})

module.exports = router
