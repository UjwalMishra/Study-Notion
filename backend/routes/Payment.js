// Import the required modules
const express = require("express");
const { isStudent, auth } = require("../middlewares/authMiddleware");
const {
  capturePayment,
  verifySignature,
} = require("../controllers/paymentsController");
const router = express.Router();

//capture payment
router.post("/capturePayment", auth, isStudent, capturePayment);
//verify payment
router.post("/verifyPayment", auth, isStudent, verifySignature);

//sendPaymentSuccessEmail ---> pending

module.exports = router;
