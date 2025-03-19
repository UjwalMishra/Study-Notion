// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  auth,
  isInstructor,
  isAdmin,
  isStudent,
} = require("../middlewares/authMiddleware");
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/courseController");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subsectionController");
const {
  createCategory,
  getAllCategories,
  getCategoryDetails,
} = require("../controllers/categoryController");
const {
  createRatingAndReview,
  getAvgRating,
  getAllRatingAndReviews,
} = require("../controllers/ratingAndReviewController");


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

//Add a Section to a Course
router.post("/createSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection);

// Add a Sub Section to a Section
router.post("/createSubsection", auth, isInstructor, createSubSection);
// update subsection i.e edit sub section
router.post("/updateSubsection", auth, isInstructor, updateSubSection);
//delete a subsection
router.delete("/deleteSubsection", auth, isInstructor, deleteSubSection);

// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.get("/getCourseDetails", getCourseDetails);

//get full detail of specific course ---> pending

//edit course details ---> pending

// Get all Courses Under a Specific Instructor ---> pending

// Delete a Course ---> pending

//update course progress ---> pending

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

// Category can Only be Created by Admin
//create category
router.post("/createCategory", auth, isAdmin, createCategory);
//get all categories
router.get("/getAllCategories", getAllCategories);
//get specific category course details
router.get("/getCategoryPageDetails", getCategoryDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

//create rating
router.post("/createRatingAndReview", auth, isStudent, createRatingAndReview);
//get avg rating
router.get("/getAverageRating", getAvgRating);
//get all rating and reviews
router.get("/getAllRatingAndReviews", getAllRatingAndReviews);

module.exports = router;
