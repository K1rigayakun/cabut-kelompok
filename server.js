require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const http = require("http")

const adminRoutes = require("./routes/admin")
const drawRoutes = require("./routes/draw")

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err))

app.use("/admin", adminRoutes)
app.use("/draw", drawRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

// buat server HTTP
const server = http.createServer(app)

// socket.io
const { Server } = require("socket.io")
const io = new Server(server, {
  cors: { origin: "*" }
})

// simpan io ke app biar bisa dipake di routes
app.set("io", io)

io.on("connection", socket => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log("Server running on port " + PORT))
