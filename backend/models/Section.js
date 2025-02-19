const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },
    //here we store the id of the sub-sections
    subSection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
