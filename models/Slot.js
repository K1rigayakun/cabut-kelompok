const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema({
  order: Number,
  group: Number
})

module.exports = mongoose.model("Slot", slotSchema)
