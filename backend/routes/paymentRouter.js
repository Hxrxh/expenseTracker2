const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const userAuthentication = require("../middleware/auth");
router.post(
  "/",
  userAuthentication.authentication,
  paymentController.paymentProcess
);

router.get(
  "/payment-status/:orderId",

  paymentController.paymentStatus
);
module.exports = router;
