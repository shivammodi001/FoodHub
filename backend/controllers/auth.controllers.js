const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genToken = require("../utils/token");
const sendOtpMail = require("../utils/mail");
// const authMiddleware = require('../middlewares/auth.middleware');

// Sign Up
const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, role } = req.body;

    // check wheather email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (mobileNumber.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 digits" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // create new user
    user = new User({ fullName, email, password: hashedPassword, mobileNumber, role });
    await user.save();

    // generate token
    const token = await genToken(user._id);
    // set token in cookie
    res.cookie("token", token, { 
        secure:false,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
     });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json('signUp failed');
  }
};

// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check wheather email already exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = await genToken(user._id);
    // set token in cookie
    res.cookie("token", token, { 
        secure:false,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
     });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json('signIn failed');
  }
};

// Sign Out
const signOut = async (req, res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({ message: "LogOut successfully" });
    }catch(err){
        console.error(err);
        res.status(500).json('signOut failed');
    }
};


///  send opt
const sendOtp = async (req, res) => {
  try{
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    user.resetOtp = otp;
    user.otpExpires = otpExpires;
    user.isOtpVerified = false;
    await user.save();

    // Send OTP to user's email
    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });

  }catch(err){
    console.error(err);
    res.status(500).json('sendOtp failed');
  }
}

/// verify otp
const verifyOtp = async (req,res) => {
    try{
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "Email does not exist" });
        }
        // invalid otp
        if (user.resetOtp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }

        // time expire
        if (user.otpExpires < Date.now()) {
          return res.status(400).json({ message: "OTP has expired" });
        } 

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({ message: "OTP verified successfully" });

    }catch(err){
        console.error(err);
        res.status(500).json('verifyOtp failed');
    }
}

// reset password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "Email does not exist or OTP not verified " });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false; // reset OTP verification status
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json('resetPassword failed');
  }
};


// Google Sign In/Up
const googleAuth = async (req, res) => {
  try{
    const {fullName,email,mobileNumber,role} = req.body;
    let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(400).json({ message: "Email already exists" });
    // }
    if(!user){
      user = await User.create({
        fullName,email,mobileNumber,role
      });
    }

    // generate token
    const token = await genToken(user._id);
    // set token in cookie
    res.cookie("token", token, { 
        secure:false,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
     });

     res.status(200).json(user);

  }catch(err){
    console.error(err);
    res.status(500).json('Google Auth failed');
  }
}

module.exports = { signUp, signIn, signOut, sendOtp, verifyOtp , resetPassword , googleAuth };