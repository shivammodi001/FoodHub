const express = require('express');
const userRouter = express.Router();
const {getCurrentUser} = require('../controllers/user.controllers');
const isAuth = require("../middleware/isAuth")


userRouter.get('/current',isAuth,getCurrentUser);

module.exports = userRouter;