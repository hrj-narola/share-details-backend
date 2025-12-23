const jwt = require("jsonwebtoken")

const generateToken = (payload, secretKey) => {
  const token = jwt.sign(payload, secretKey)
  return token;
}

module.exports = generateToken