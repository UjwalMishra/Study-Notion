const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

//create review
exports.createRatingAndReview = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user._id;

    if (!courseId || !rating || !review) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    //check if user enrolled in course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const userEnrolled = course.studentsEnrolled.includes(userId);
    if (!userEnrolled) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    //if user already reviewed course
    const reviewExists = await RatingAndReview.findOne({
      course: courseId,
      user: userId,
    });
    if (reviewExists) {
      return res
        .status(400)
        .json({ message: "You already reviewed this course" });
    }

    //create new rating and review
    const newRatingAndReview = await RatingAndReview.create({
      course: courseId,
      user: userId,
      rating: rating,
      review: review,
    });

    //update course model
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingsAndReviews: newRatingAndReview._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review created successfully",
      newRatingAndReview,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error creating review",
    });
  }
};

//get average rating of course
exports.getAvgRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        message: "No ratings found of this course as of now",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error getting average rating",
    });
  }
};

//get all rating and reviews
exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const ratingAndReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName ",
      })
      .exec();

    return res.status(200).json({
      success: true,
      ratingAndReviews: ratingAndReviews,
      message: "All Rating and Reviews fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error getting all rating and reviews",
    });
  }
};

// fetch rating and reviws of particular course
