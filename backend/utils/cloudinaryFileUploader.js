// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file limit
//   fileFilter: (req, file, cb) => {
//     const supportedTypes = [
//       "image/jpeg",
//       "image/png",
//       ".jpg",
//       "image/webp",
//       "video/mp4",
//       "video/mpeg",
//       "video/quicktime",
//       "video/x-msvideo",
//     ];
//     if (supportedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("File type not supported"), false);
//     }
//   },
// });

// // Cloudinary Upload Function
// const uploadFileToCloudinary = async (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const options = { folder, resource_type: "auto" };

//     const stream = cloudinary.uploader.upload_stream(
//       options,
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Upload Error:", error);
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     stream.end(buffer);
//   });
// };

// module.exports = { upload, uploadFileToCloudinary };

const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
