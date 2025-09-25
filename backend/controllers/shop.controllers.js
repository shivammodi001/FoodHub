const express = require("express");
const Shop = require("../models/shop.model");
const uploadOnCloudinary = require("../utils/cloudinary");

// Create or Edit Shop
const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Check if shop already exists for this user
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      // Update existing shop
      const updateData = { name, city, state, address };
      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner items");

    return res.status(201).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `create shop error ${err}` });
  }
};

//get shop
const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } },
    ]);
    if (!shop) {
      return null;
    }

    return res.status(200).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `get my shop error ${err}` });
  }
};

const getShopByCity = async (req, res) => {
  try {
    const city = req.params.city;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops) {
      return res.status(400).json({ message: "Shops not found in your city" });
    }
    return res.status(200).json(shops);
  } catch (err) {
    return res.status(500).json({ message: `get shops by city error ${err}` });
  }
};

module.exports = { createEditShop, getMyShop ,getShopByCity};
