const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    courseLanguage: {
      type: String,
      enum: ["Hindi", "English", "Hinglish"],
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otherInfo: {
      type: String,
      trim: true,
    },
    //here we store id of sections
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    ratingsAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Draft", "Published"],
    },
    instructions: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
