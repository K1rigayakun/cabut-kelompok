const mongoose = require("mongoose")

const settingsSchema = new mongoose.Schema({
  groups: { type: Number, default: 7 },
  maxPerGroup: { type: Number, default: 6 }
})

module.exports = mongoose.model("Settings", settingsSchema)
