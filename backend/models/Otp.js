const mongoose = require("mongoose");
const { sendMail } = require("../utils/mailSender");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 300, // 5 minutes
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

async function sendVarificationMail(email, otp) {
  try {
    const mailRes = sendMail(email, "Mail from Study-Notion", `OTP is ${otp}`);
    console.log("Mail sent : ", mailRes);
  } catch (err) {
    console.log("error occured while sending mail in models/Otp ->", err);
  }
}

otpSchema.pre("save", async function (next) {
  await sendVarificationMail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
