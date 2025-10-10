const express = require("express");

const router = express.Router();
const forgotPassController = require("../controller/forgotPassController");
router.post("/password/forgotpassword", forgotPassController.forgotFunction);

module.exports = router;
