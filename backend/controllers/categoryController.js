const mongoose = require("mongoose");
const Category = require("../models/Category");

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
