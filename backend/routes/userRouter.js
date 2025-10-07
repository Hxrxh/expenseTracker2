const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/auth");
const userController = require("../controller/userController");
router.post("/signup", userController.addUserSignupDetails);
router.post("/login", userController.handleLogin);
router.get(
  "/check-premium",
  userAuthentication.authentication,
  userController.checkPremium
);
module.exports = router;
