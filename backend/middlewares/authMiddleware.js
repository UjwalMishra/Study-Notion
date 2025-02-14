const User = require("../models/User");
const { validateToken } = require("../utils/createAndValidateToken");

// 1. auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "") ||
      req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    // verify token
    const decoded = validateToken(token);
    // if token is valid, add user to request
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while authenticating user",
    });
  }
};
//2. isStudent
exports.isStudent = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "student") {
      return res.status(403).json({
        success: false,
        message: "You are not a student",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while checking user role",
    });
  }
};

//3. isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "You are not an instructor",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while checking user role",
    });
  }
};

//4. isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while checking user role",
    });
  }
};
