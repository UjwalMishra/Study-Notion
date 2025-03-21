const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure env variables are loaded

const cloudinaryConnection = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("Cloudinary connected successfully!");
};

module.exports = cloudinaryConnection;
