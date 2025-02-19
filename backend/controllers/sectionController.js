const Course = require("../models/Course");
const Section = require("../models/Section");

//create section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body; //we will put courseId in body of request in frontend
    if (!sectionName || !courseId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const section = await Section.create({ sectionName });
    console.log("created Section : ", section);

    //update course with section id
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: section._id },
      },
      { new: true }
    )
      .populate("courseContent")
      .populate("subSection");

    console.log("Course : ", course);

    return res.status(200).json({
      success: true,
      message: "Section created and added to course successfully",
      data: course,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    console.log("Updated Section : ", section);

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body;
    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }

    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
    });
  }
};
