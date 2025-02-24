const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const sendMail = require("../utils/mailSender");
const mongoose = require("mongoose");

//capture payment --> initiate payment
exports.capturePayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    //validate
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "UserId or CourseId is missing",
      });
    }
    //get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    // if user have already purchased the course

    // const uid = new mongoose.Types.ObjectId(userId);
    const uid = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "User already purchased the course",
      });
    }

    //create order
    const amount = course.coursePrice;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    //initiate payment using razorpay
    try {
      const paymentRes = await instance.orders.create(options);
      console.log("Payment res :", paymentRes);
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentRes.id,
        currency: paymentRes.currency,
        amount: paymentRes.amount,
        message: "Payment captured",
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "Could not initiate payment",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//verifying signature of razorpay and server
exports.verifySignature = async (req, res) => {
  try {
    const webHookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    //signature came from razorpay is hashed, so for matching we need to hash the webHookSecret
    const hashedSecret = crypto.createHmac("sho256", webHookSecret);
    hashedSecret.update(JSON.stringify(req.body));
    const digest = hashedSecret.digest("hex");

    //match digest with signature
    if (signature !== digest) {
      console.log("Payment not authorized");
      return res.status(400).json({
        success: false,
        message: "Payment not authorized",
      });
    }

    //performing action
    console.log("Payment authorized");
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      const courseEnrolled = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: { studentsEnrolled: userId },
        },
        { new: true }
      );

      if (!courseEnrolled) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log("Course enrolled : ", courseEnrolled);

      //updating user collection
      const userEnrolled = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { courses: courseId },
        },
        { new: true }
      );
      if (!userEnrolled) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      console.log("User enrolled : ", userEnrolled);

      //send email to user for course enrollment
      const emailRes = await sendMail(
        userEnrolled.email,
        "Course Enrollment",
        `Congratulations, you have enrolled in the course: ${courseEnrolled.courseName}`
      );

      console.log("Email : ", emailRes);
      return res.status(200).json({
        success: true,
        message: "Course enrolled successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};
