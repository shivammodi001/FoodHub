const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Your OTP Code",
        html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });
}
const sendDeliveryOtpMail = async (user, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to:user.email,
        subject: "Delivery OTP",
        html: `<p>...Your Delivery OTP is <b>${otp}</b>. It is valid for 5 minutes.Please don't with anyone accept DeliveryBoy...</p>`,
    });
}


module.exports = {sendOtpMail , sendDeliveryOtpMail};