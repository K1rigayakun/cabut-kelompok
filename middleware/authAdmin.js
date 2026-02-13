const jwt = require("jsonwebtoken")

module.exports = function authAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({ error: "No token" })

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
}
