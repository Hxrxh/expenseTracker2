const express = require("express");

const router = express.Router();
const userAuthentication = require("../middleware/auth");
const forgotPassController = require("../controller/forgotPassController");
router.post(
  "/called/password/forgotpassword",

  forgotPassController.forgotFunction
);
router.get("/resetpassword", forgotPassController.resetPassword);
router.post("/updatePassword", forgotPassController.updatePassword);
module.exports = router;
