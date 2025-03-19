const mongoose = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    //validations
    if (!name || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    //create category
    const category = {
      name,
      description,
    };
    //save to database
    const newcategory = await Category.create(category);
    console.log("category created : ", newcategory);
    //res
    return res.status(200).json({
      success: true,
      message: "category created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating category",
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("All categories : ", categories);
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching categories",
    });
  }
};

//fetch courses by category
exports.getCategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide category id",
      });
    }

    //selected category courses
    const selectedCategoryCourses = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    if (!selectedCategoryCourses) {
      return res.status(404).json({
        success: false,
        message: "Courses for selected category not found",
      });
    }

    //top selling courses
    const topSellingCourses = await Course.find().sort({
      studentsEnrolled: -1,
    });

    //other courses
    const otherCourses = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses");

    //return res
    return res.status(200).json({
      success: true,
      data: {
        selectedCategoryCourses,
        topSellingCourses: topSellingCourses.slice(0, 5),
        otherCourses,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching category details",
    });
  }
};
