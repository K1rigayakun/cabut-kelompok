const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema({
  order: { type: Number, unique: true },
  group: Number,
  taken: { type: Boolean, default: false }
})

module.exports = mongoose.model("Slot", slotSchema)
