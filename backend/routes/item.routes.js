const express = require('express');
const itemRouter = express.Router();
const { addItem, editItem ,getItemById ,deleteIem , getItemsByCity,getItemsByShop,searchItems,rating} = require("../controllers/items.controllers");
const isAuth = require("../middleware/isAuth")
const {upload} = require("../middleware/multer")

itemRouter.post("/add-item",isAuth,upload.single("image"),addItem);
itemRouter.post("/edit-item/:itemId",isAuth,upload.single("image"),editItem);
itemRouter.get("/get-by-id/:itemId",isAuth,getItemById);
itemRouter.delete("/delete/:itemId",isAuth,deleteIem);
itemRouter.get("/get-by-city/:city",isAuth,getItemsByCity);
itemRouter.get("/get-items-by-shop/:shopId",isAuth,getItemsByShop);
itemRouter.get("/search-items",isAuth,searchItems);
itemRouter.post("/rating",isAuth,rating);



module.exports = itemRouter;