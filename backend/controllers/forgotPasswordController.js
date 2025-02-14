const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/");

//1. reset password token
const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    console.log("token generate in password reset : ", token);
    //save token in user document
    const updatedUser = await User.findByIdAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpire: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    //url
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail
    await sendMail(email, "Reset Password", `Link : ${url}`);
    //res
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while sending email for password reset",
    });
  }
};

//2. reset password
exports.resetPass = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body; //frontend will put token in body from params
    if (!password || !confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "Password and Confirm Password are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "Password and Confirm Password must match",
      });
    }
    //validate token
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid token",
      });
    }
    //token-time check
    if (user.resetPasswordExpire < Date.now()) {
      return res.status(404).json({
        success: false,
        message: "Token Expired, please generate a new one",
      });
    }
    //hash pass
    const hashedPassword = await bcrypt.hash(password, 10);
    //update user
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while resetting password",
    });
  }
};
