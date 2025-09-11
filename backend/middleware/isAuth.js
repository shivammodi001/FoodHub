const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    // console.log("Cookies from client:", req.cookies);

    const token = req.cookies.token; // ✅ correct (req.cookies not req.cookie)
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    req.userId = decoded.userId; // ✅ match the payload key

    next();
  } catch (err) {
    console.error("isAuth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isAuth;
