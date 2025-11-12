const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfree-service");

const jwt = require("jsonwebtoken");

const paymentTable = require("../models/payment");
const { userTable } = require("../models");

const paymentProcess = async (req, res) => {
  try {
    const orderId = "order" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = "1";
    const customerPhone = "9999999099";
    const userId = req.user.id;

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );
    await paymentTable.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
      userId: userId,
    });
    res.json({ paymentSessionId, orderId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error processing the payment" });
  }
};
const paymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderStatus = await getPaymentStatus(orderId);

    if (!orderStatus) {
      return res.status(500).send("No order status found");
    }
    const paymentdata = await paymentTable.findOne({
      where: {
        orderId: orderId,
      },
    });
    if (paymentdata) {
      await paymentTable.update(
        {
          paymentStatus: orderStatus,
        },
        {
          where: {
            orderId: orderId,
          },
        }
      );
      await userTable.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: paymentdata.userId,
          },
        }
      );
      return res.redirect(`http://127.0.0.1:5500/frontend/expense.html`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { paymentProcess, paymentStatus };
