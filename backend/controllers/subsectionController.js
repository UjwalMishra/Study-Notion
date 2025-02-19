const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const uploadFileToCloudinary = require("../utils/cloudinaryFileUploader");

require("dotenv").config();
//create sub-section
exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const videoFile = req.file;

    //validations
    if (!title || !timeDuration || !description || !videoFile || !sectionId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //upload video to cloudinary to get url
    const uploadedVideo = await uploadFileToCloudinary(
      videoFile.buffer,
      process.env.CLOUDINARY_FOLDER_NAME
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

    const videoFile = req.file;
    let updateData = { title, timeDuration, description };

    if (videoFile) {
      //delete old video
      const subSection = await SubSection.findById(subSectionId);
      if (subSection && subSection.cloudinary_public_id) {
        try {
          await cloudinary.uploader.destroy(subSection.cloudinary_public_id);
        } catch (cloudinaryError) {
          return res.status(500).json({
            message: "Failed to delete video from Cloudinary",
            error: cloudinaryError.message,
          });
        }
      }
      //upload new video
      const uploadedVideo = await uploadFileToCloudinary(
        videoFile.buffer,
        process.env.CLOUDINARY_FOLDER_NAME
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
    const { subSectionId } = req.body;
    //validate
    if (!subSectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Sub-section ID is required" });
    }

    //delete sub-section
    await SubSection.findByIdAndDelete(subSectionId);

    //return res
    return res.status(200).json({
      success: true,
      message: "Sub-section deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error deleting sub-section",
    });
  }
};
