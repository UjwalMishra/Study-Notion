const Category = require("../models/Category");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/cloudinaryFileUploader");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

//1. course creation
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      courseLanguage,
      coursePrice,
      otherInfo,
      category,
    } = req.body;
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnail;

    console.log("Received File:", req.files);
    console.log("Request Body:", req.body);

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
    const userId = req.user._id;
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
    const uploadThumbnail = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
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
      // cloudinary_public_id ---> pending
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

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }
    // const course = await Course.findById(courseId).populate("instructor").populate("category");
    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingsAndReviews")
      .populate("studentsEnrolled")
      .exec();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "course details fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
    });
  }
};

//3. delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate input
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Fetch section details
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;

        // Fetch all sub-sections
        const subSectionDocs = await SubSection.find({
          _id: { $in: subSections },
        });

        // Delete associated videos from Cloudinary
        for (const subSection of subSectionDocs) {
          if (subSection.cloudinary_public_id) {
            try {
              console.log(
                "Deleting video with ID:",
                subSection.cloudinary_public_id
              );
              const result = await cloudinary.uploader.destroy(
                subSection.cloudinary_public_id,
                { resource_type: "video" }
              );
              console.log("Cloudinary deletion response:", result);

              if (result.result !== "ok") {
                return res.status(500).json({
                  message: "Failed to delete video from Cloudinary",
                  error: result,
                });
              }
            } catch (cloudinaryError) {
              return res.status(500).json({
                success: false,
                message: "Error deleting video from Cloudinary",
                error: cloudinaryError.message,
              });
            }
          }
        }

        // Delete sub-sections
        await SubSection.deleteMany({ _id: { $in: subSections } });
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and all its content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
