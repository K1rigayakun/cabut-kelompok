const mongoose = require("mongoose")

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  nim: String
})

module.exports = mongoose.model("Device", deviceSchema)
