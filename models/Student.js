const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  nim: { type: String, unique: true },
  group: Number
})

module.exports = mongoose.model("Student", studentSchema)
