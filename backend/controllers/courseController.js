const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const uploadFileToCloudinary = require("../utils/cloudinaryFileUploader");
require("dotenv").config();
//1. course creation
exports.createCourrse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      courseLanguage,
      coursePrice,
      otherInfo,
      category,
    } = req.body;
    //fetch thumbnail
    const thumbnail = req.file;
    //validations
    if (
      !courseName ||
      !courseDescription ||
      !courseLanguage ||
      !coursePrice ||
      !otherInfo ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    //fetching instructor's info
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }
    console.log("Instructor : ", instructorDetails);
    //validate category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "category not found",
      });
    }

    //upload image to cloudinary
    const uploadThumbnail = await uploadFileToCloudinary(
      thumbnail.buffer,
      process.env.CLOUDINARY_FOLDER_NAME
    );
    //create course
    const course = await Course.create({
      courseName,
      courseDescription,
      courseLanguage,
      coursePrice,
      otherInfo,
      instructor: instructorDetails._id,
      category: categoryDetails._id,
      thumbnail: uploadThumbnail.secure_url,
    });
    console.log("Url of img : ", uploadThumbnail.secure_url);
    console.log("course created : ", course);

    //update User object i.e add this course to courses array of user schema
    instructorDetails.courses.push(course._id);
    await instructorDetails.save();

    //update category object i.e add this course array of category schema
    categoryDetails.courses.push(course._id);
    await categoryDetails.save();

    //return res
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course: course,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error creating course",
    });
  }
};

//2. fetch all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        courseLanguage: true,
        coursePrice: true,
        thumbnail: true,
        instructor: true,
        category: true,
      }
    )
      .populate("instructor")
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};
