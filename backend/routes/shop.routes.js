const express = require('express');
const shopRouter = express.Router();
const {createEditShop, getMyShop,getShopByCity} = require("../controllers/shop.controllers");
const isAuth = require("../middleware/isAuth")
const {upload} = require("../middleware/multer")

shopRouter.post('/create-edit',isAuth,upload.single("image"),createEditShop);
shopRouter.get('/get-my',isAuth,getMyShop);
shopRouter.get('/get-by-city/:city',isAuth,getShopByCity);

module.exports = shopRouter;