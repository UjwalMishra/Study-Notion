// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  getUserDetails,
  updateProfile,
  deleteAccount,
} = require("../controllers/updateProfile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

//route for getting user profile
router.get("/getUserDeatils", getUserDetails);
//route for updating profile
router.put("/updateProfile", updateProfile);
//route for deleting profile
router.delete("/deleteProfile", deleteAccount);

module.exports = router;
