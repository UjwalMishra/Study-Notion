const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/cloudinaryFileUploader");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
//create sub-section
exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const videoFile = req.files.videoFile;

    //validations
    if (!title || !timeDuration || !description || !videoFile || !sectionId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Upload the video file to Cloudinary
    const uploadedVideo = await uploadImageToCloudinary(
      videoFile,
      process.env.FOLDER_NAME
    );

    //create sub-section
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadedVideo.secure_url,
      cloudinary_public_id: uploadedVideo.public_id,
    });

    //update section with sub-section id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSection: subSectionDetails._id },
      },
      { new: true }
    ).populate("subSection");

    console.log("updated section : ", updatedSection);

    //return res
    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error creating sub-section",
    });
  }
};

// update sub-section
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;
    if (!title || !timeDuration || !description || !subSectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const videoFile = req.files ? req.files.videoFile : null;
    let updateData = { title, timeDuration, description };
    console.log("video : ", videoFile);

    if (videoFile) {
      //delete old video
      const subSection = await SubSection.findById(subSectionId);
      console.log("sub section", subSection);
      console.log("cloudinary id : ", subSection.cloudinary_public_id);
      if (subSection && subSection.cloudinary_public_id) {
        try {
          const result = await cloudinary.uploader.destroy(
            subSection.cloudinary_public_id,
            { resource_type: "video" }
          );
          console.log("Cloudinary deletion response:", result);
        } catch (cloudinaryError) {
          return res.status(500).json({
            message: "Failed to delete video from Cloudinary",
            error: cloudinaryError.message,
          });
        }
      }
      //upload new video
      const uploadedVideo = await uploadImageToCloudinary(
        videoFile,
        process.env.FOLDER_NAME
      );

      updateData.videoUrl = uploadedVideo.secure_url;
      updateData.cloudinary_public_id = uploadedVideo.public_id;
    }

    // updating sub-section
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub-section updated successfully",
      updatedSubSection,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error updating sub-section" });
  }
};

//delete sub-section
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    // Validate input
    if (!subSectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Sub-section ID is required" });
    }

    // Find the sub-section
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-section not found" });
    }

    // Delete the video from Cloudinary if it exists
    if (subSection.cloudinary_public_id) {
      console.log("Deleting video with ID:", subSection.cloudinary_public_id);
      try {
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

    // Delete the sub-section from the database
    await SubSection.findByIdAndDelete(subSectionId);
    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.status(200).json({
      success: true,
      message: "Sub-section and associated video deleted successfully",
      data: updatedSection,
    });
  } catch (err) {
    console.error("Error deleting sub-section:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting sub-section" });
  }
};
