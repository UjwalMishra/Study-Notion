const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
    },
    about: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
