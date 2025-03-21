// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  getUserDetails,
  updateProfile,
  deleteAccount,
} = require("../controllers/updateProfile");
const { auth } = require("../middlewares/authMiddleware");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

//route for getting user profile
router.get("/getUserDetails", auth, getUserDetails);
//route for updating profile
router.put("/updateProfile", auth, updateProfile);
//route for deleting profile
router.delete("/deleteProfile", auth, deleteAccount);

module.exports = router;
