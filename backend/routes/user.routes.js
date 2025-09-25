const express = require('express');
const userRouter = express.Router();
const {getCurrentUser,updateUserLocation} = require('../controllers/user.controllers');
const isAuth = require("../middleware/isAuth")


userRouter.get('/current',isAuth,getCurrentUser);
userRouter.post('/update-location',isAuth,updateUserLocation);


module.exports = userRouter;