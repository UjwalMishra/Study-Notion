const mongoose = require("mongoose");

const subsectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    timeDuration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    cloudinary_public_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubSection", subsectionSchema);
