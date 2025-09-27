const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
router.post("/signup", userController.addUserSignupDetails);
router.post("/login", userController.handleLogin);
module.exports = router;
