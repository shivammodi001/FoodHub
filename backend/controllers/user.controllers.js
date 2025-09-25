const User = require("../models/user.model");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from isAuth middleware
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const user = await User.findById(userId).select("-password"); // ✅ exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    return res
      .status(500)
      .json({ message: `get current user error: ${err.message}` });
  }
};

const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    // console.log("📩 Incoming location update:", { lat, lon });
    // console.log("👤 User ID from token/session:", req.userId);

    // Check required fields
    if (lat == null || lon == null) {
      return res.status(400).json({ error: "Latitude and Longitude required" });
    }

    // Update location in DB
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [lon, lat], // ✅ GeoJSON format => [longitude, latitude]
          },
        },
      },
      { new: true } // return updated document
    );

    if (!user) {
      // console.log("❌ No user found with id:", req.userId);
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("✅ User location updated in DB:", user.location);

    return res.status(200).json({
      message: "Location Updated",
      location: user.location, // ✅ return back updated location
    });
  } catch (err) {
    return res.status(500).json({ message: "User Location Update Error" });
  }
};



module.exports = { getCurrentUser, updateUserLocation };
