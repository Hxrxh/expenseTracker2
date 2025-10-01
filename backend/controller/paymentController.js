const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfree-service");

const paymentTable = require("../models/payment");

const paymentProcess = async (req, res) => {
  try {
    const orderId = "order" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = "1";
    const customerPhone = "9999999099";

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
    }
    res.send(`<h1>${orderStatus}</h1>`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { paymentProcess, paymentStatus };
