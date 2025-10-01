const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/", paymentController.paymentProcess);
router.get("/payment-status/:orderId", paymentController.paymentStatus);
module.exports = router;
