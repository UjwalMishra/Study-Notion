const Profile = require("../models/Profile");
const User = require("../models/User");

//update profile
exports.updateProfile = async (requestAnimationFrame, res) => {
  try {
    const {
      gender,
      age,
      about = "",
      profession = "",
      address = "",
      phoneNumber,
    } = req.body;
    //valiodate
    if (!gender || !age || !phoneNumber) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    //get user id
    const userId = req.user._id;
    //get user profile
    const userDetails = await User.findById({ userId });
    //get profile id
    const profileId = userDetails.additionalDetails;

    //find and update profile
    const updateProfile = await Profile.findByIdAndUpdate(
      { profileId },
      {
        gender,
        age,
        about,
        profession,
        address,
        phoneNumber,
      },
      { new: true }
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updateProfile,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
    });
  }
};

//delete account/profile
exports.deleteAccount = async (req, res) => {
  try {
    //get user id
    const userId = req.user._id;
    //validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }
    //get user
    const userDetails = await User.findById({ userId });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //get profile id
    const profileId = userDetails.additionalDetails;
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "Profile id not found",
      });
    }

    //find cron job ? and also need to schedule the delete profile operatrion i.e deletion of profile should not be immediate

    //delete profile
    await Profile.findByIdAndDelete(profileId);

    //todo
    //delete user from all collections like enroll,courses etc

    //delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error while deleting account",
    });
  }
};

//get user details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const userDetails = await User.findById(userId).populate(
      "additionalDetails",
      "courses",
      "courseProgress"
    );

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User details:", userDetails);

    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      userDetails,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user details",
    });
  }
};
