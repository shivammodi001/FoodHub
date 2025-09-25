const Shop = require("../models/shop.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const Item = require("../models/item.model");
const { options } = require("../routes/item.routes");

const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } },
    ]);
    return res.status(201).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `add item error ${err}` });
  }
};

const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(201).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `edit item error ${err}` });
  }
};

// item ko find karo uski id se
const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({ message: `Get item Error ${err}` });
  }
};

const deleteIem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i._id !== item._id); // deleted id ke jo eqaul id ko shop me items array se update kr denge
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (err) {
    return res.status(500).json({ message: `Delete item Error ${err}` });
  }
};

const getItemsByCity = async (req, res) => {
  try {
    const city = req.params.city;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(400).json({ message: "Shops not found in your city" });
    }

    const items = [];
    shops.forEach((shop) => {
      shop.items.forEach((item) => {
        items.push({
          ...item.toObject(),
          shopName: shop.name,
        });
      });
    });

    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ message: `get items by city Error ${err}` });
  }
};

const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");

    if (!shop) {
      return res.status(400).json({ message: "Shops not found" });
    }
    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    return res.status(500).json({ message: "Get Items By Shop error" });
  }
};

const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) {
      return null;
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

     if (!shops) {
      return res.status(400).json({ message: "Shops not found in your city" });
    }

    const shopIds = shops.map(s=>s.id);
    const items = await Item.find({
      shop:{$in:shopIds},
      $or:[
        {name:{$regex:query,$options:"i"}},
        {category:{$regex:query,$options:"i"}}
      ]
    }).populate("shop","name image");

     return res.status(200).json(items);

  } catch (error) {
     return res.status(500).json({ message: "Search Items error" });
  }
};


const rating = async (req,res)=>{
  try {
    const {itemId,rating} = req.body;
    
  // console.log("BODY:", req.body, "USERID:", req.userId);
  // // rest of code...


    if(!itemId || !rating){
      return res.status(400).json({message:'Item id and rating is required'});
    }
    
    if(rating<1 || rating >5){
      return res.status(400).json({message:'rating must be between 1 to 5'});
    }

    const item = await Item.findById(itemId);
    if(!item){
      return res.status(400).json({message:'item not found'});
    }

    const newCount = item.rating.count + 1;
    const newAverage = (item.rating.average*item.rating.count + rating)/newCount;

    item.rating.count = newCount;
    item.rating.average = newAverage;
    await item.save();

    return res.status(200).json({rating:item.rating});

  } catch (error) {
    return res.status(400).json({message:`rating error ${error}`});
  }
}

module.exports = {
  addItem,
  editItem,
  getItemById,
  deleteIem,
  getItemsByCity,
  getItemsByShop,
  searchItems,
  rating
};
