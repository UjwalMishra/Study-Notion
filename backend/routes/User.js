// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  changePassword,
  sendOtp,
} = require("../controllers/authController");
const { auth } = require("../middlewares/authMiddleware");
const {
  resetPasswordToken,
  resetPass,
} = require("../controllers/forgotPasswordController");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);
// Route for user signup
router.post("/signup", signUp);
// Route for send otp
router.post("/sendotp", sendOtp);
// Route for change password
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPass);

// Export the router for use in the main application
module.exports = router;
