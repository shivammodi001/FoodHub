const express = require('express');
const authRouter = express.Router();
const { signUp, signIn, signOut , sendOtp , verifyOtp , resetPassword , googleAuth } = require('../controllers/auth.controllers');

// Auth routes
authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/signout', signOut);
// OTP routes
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/reset-password', resetPassword);

// google Auth
authRouter.post('/google-auth',googleAuth);

module.exports = authRouter;