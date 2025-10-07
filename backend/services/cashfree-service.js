const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034",
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
);

const createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerId,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();
    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `http://localhost:3000/pay/payment-status/${orderId}`,
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
    };
    const response = await cashfree.PGCreateOrder(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.log(error);
  }
};
const getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.some(
        (transaction) => transaction.payment_status === "SUCCESS"
      )
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.some(
        (transaction) => transaction.payment_status === "PENDING"
      )
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
    return orderStatus;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { createOrder, getPaymentStatus };
