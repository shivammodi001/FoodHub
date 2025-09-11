const jwt = require("jsonwebtoken");

const genToken = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error("Token generation failed");
  }
};
module.exports = genToken;