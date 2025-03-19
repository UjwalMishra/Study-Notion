const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const storage = multer.memoryStorage();

const supportedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
];

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (supportedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"), false);
    }
  },
});

// Cloudinary Upload Function
async function uploadFileToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const options = { folder, resource_type: "auto" };
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
}

module.exports = { upload, uploadFileToCloudinary };
