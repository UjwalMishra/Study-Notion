const mongoose = require("mongoose");
const Tag = require("../models/Tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    //validations
    if (!name || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    //create tag
    const tag = {
      name,
      description,
    };
    //save to database
    const newTag = await Tag.create(tag);
    console.log("Tag created : ", newTag);
    //res
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating tag",
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    console.log("All Tags : ", tags);
    return res.status(200).json({
      success: true,
      tags,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching tags",
    });
  }
};
