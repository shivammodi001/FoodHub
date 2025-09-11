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
    return res.status(500).json({ message: `get current user error: ${err.message}` });
  }
};

module.exports = { getCurrentUser };
