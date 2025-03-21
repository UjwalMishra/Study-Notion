const User = require("../models/User");
const OTP = require("../models/Otp");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
//for otp generation
const crypto = require("crypto");
//for token generation
const { createTokenForUser } = require("../utils/createAndValidateToken");
const sendMail = require("../utils/mailSender");

//otp-generator fxn
function generateOTP(length) {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}

//image-generator fxn
const getInitialsAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff`;
};

// 1. send otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const isUserAlreadyExists = await User.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    //generate otp
    let otp = generateOTP(6);

    let isOtpAlreadyExists = await OTP.findOne({ otp: otp });
    //this is not efficient way as we have to check otp everytime and make db calls again and again
    //so here is scope of improvement for me
    while (isOtpAlreadyExists) {
      otp = generateOTP(6);
      isOtpAlreadyExists = await OTP.findOne({ otp: otp });
    }
    console.log("OTP generated : ", otp);

    const otpPayload = {
      email,
      otp,
    };
    //insert otp in db
    const otpInsert = await OTP.create(otpPayload);
    //sending otp to mail logic is already there in otp schema using pre method

    //sending res
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during OTP sending",
      error: err.message,
    });
  }
};

//2. signup
exports.signUp = async (req, res) => {
  try {
    const {
      role,
      firstName,
      lastName,
      email,
      phoneNum,
      password,
      confirmPassword,
      otp,
    } = req.body;
    //validations
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    //check pass and confirm pass
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not match",
      });
    }
    //check if email already exists
    const isUserAlreadyExists = await User.findOne({ email: email });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    //find most recent otp coresponding to the email
    const recentOtp = await OTP.findOne({ email: email }).sort({
      createdAt: -1, //createdAt : -1 -> sorts in decending order means newly created are at last
    });
    console.log("otp from db", recentOtp);

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    //validating otp
    if (recentOtp.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //everything ok, let's create user
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //we have create a profile in db as we have to pass profile's object id in user
    const profile = await Profile.create({
      gender: null,
      age: null,
      profession: null,
      about: null,
      address: null,
      phoneNumber: phoneNum || null,
    });
    //create user
    const imgUrl = getInitialsAvatar(firstName + " " + lastName);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      additionalDetails: profile._id,
      image: imgUrl,
    });
    console.log("User created : ", user);
    //return res
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during user creation",
      error: err.message,
    });
  }
};

//3. login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validations
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    //check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }
    //remove password from user object
    user.password = undefined;
    //everything is fine, let's create token
    const token = createTokenForUser(user);
    console.log("Token generated : ", token);

    user.token = token;

    //return res as cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during login",
      error: err.message,
    });
  }
};

//4. change password
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
    //validations
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findOne({ email });
    // Handle case where user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //checking newPassword and confirmNewPassword
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    //check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //change old password with new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    //we can send mail also that password is changed
    const bodyOfMail = {
      subject: "Password Changed",
      text: "Your password is changed",
    };
    const mail = sendMail(email, "Mail from Study-Notion", bodyOfMail);
    console.log("Mail for changing pass : ", mail);
    //sending res
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during change password",
      error: err.message,
    });
  }
};
