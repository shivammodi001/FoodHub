const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
      type: String
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'deliveryBoy'],
        required: true,
    },
    resetOtp :{
      type : String,
    },
    isOtpVerified:{
      type: Boolean,
      default: false
    },
    otpExpires:{
      type: Date,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
