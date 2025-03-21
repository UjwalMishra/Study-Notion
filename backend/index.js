const express = require("express");
const app = express();

//importing routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

//importing databse setup
const dbConnect = require("./config/dbConnect");

//importing cloudinary
const cloudinaryConnection = require("./config/cloudinaryConnect");

//importing file upload
const fileUpload = require("express-fileupload");

//importing cookie-parser
const cookieParser = require("cookie-parser");

//importing cors
const cors = require("cors");

//importing dotenv
require("dotenv").config();

// Cloudinary connection
cloudinaryConnection();

//get port number
const PORT = process.env.PORT || 4000;

//adding middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//db connection call
dbConnect.connectDB();

//mounting routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

//default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is running successfully",
  });
});

//listen server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
