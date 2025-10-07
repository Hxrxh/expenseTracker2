const jwt = require("jsonwebtoken");
const userTable = require("../models/userModel");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = jwt.verify(token, "98cpe05ad32jil3cadffe42klax9321kdees0");

    const userData = await userTable.findByPk(user.userId);
    if (userData) {
      req.user = userData;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
module.exports = { authentication };
