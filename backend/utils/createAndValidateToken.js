const JWT = require("jsonwebtoken");
require("dotenv").config();

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  // Add expiration time
  const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    return null; // Return null if token is invalid or expired
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
