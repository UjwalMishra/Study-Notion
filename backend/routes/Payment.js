// Import the required modules
const express = require("express");
const { isStudent, auth } = require("../middlewares/authMiddleware");
const {
  capturePayment,
  verifyPayment,
} = require("../controllers/paymentsController");
const router = express.Router();

//capture payment
router.post("/capturePayment", auth, isStudent, capturePayment);
//verify payment
router.post("/verifyPayment", auth, isStudent, verifyPayment);

//sendPaymentSuccessEmail ---> pending

module.exports = router;
