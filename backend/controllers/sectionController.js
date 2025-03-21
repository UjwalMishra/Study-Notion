const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const cloudinary = require("cloudinary").v2;

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
    );

    console.log("Course : ", course);

    return res.status(200).json({
      success: true,
      message: "Section created and added to course successfully",
      data: course,
      section: section,
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
    const { sectionId, courseId } = req.body;

    // Validate input
    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }

    // Remove section reference from the course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // Fetch section details
    const section = await Section.findById(sectionId);
    console.log("Section ID:", sectionId, "Course ID:", courseId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Fetch all sub-sections associated with the section
    const subSections = await SubSection.find({
      _id: { $in: section.subSection },
    });

    // Delete associated videos from Cloudinary
    for (const subSection of subSections) {
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

    // Delete all sub-sections from the database
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // Delete the section
    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section and its sub-sections deleted successfully",
    });
  } catch (err) {
    console.error("Error while deleting section:", err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
    });
  }
};
