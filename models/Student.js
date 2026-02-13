const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  nim: { type: String, unique: true },
  group: Number,
  deviceId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Student", studentSchema)
