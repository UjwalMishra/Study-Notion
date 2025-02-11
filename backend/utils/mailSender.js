const nodemailer = require("nodemailer");

require("dotenv").config();

const sendMail = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion || Ujwal Mishra",
      to: email,
      subject: title,
      html: body,
    });
    console.log("mail : ", info);
    return info;
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
