const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema({
  order: Number,
  group: Number,
  taken: { type: Boolean, default: false }
})

module.exports = mongoose.model("Slot", slotSchema)
