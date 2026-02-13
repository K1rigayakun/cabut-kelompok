require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const drawRoutes = require("./routes/draw")
const adminRoutes = require("./routes/admin")

app.use("/draw", drawRoutes)
app.use("/admin", adminRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running")
})

const groupRoutes = require("./routes/groups");
app.use("/groups", groupRoutes);
