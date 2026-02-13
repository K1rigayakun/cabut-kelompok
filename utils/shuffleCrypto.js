const crypto = require("crypto")

function shuffleCrypto(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

module.exports = shuffleCrypto
