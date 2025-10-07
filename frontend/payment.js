const cashfree = Cashfree({
  mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    let token = localStorage.getItem("token");
    console.log(token);
    const response = await axios.post(
      "http://localhost:3000/pay",
      {},
      {
        headers: { Authorization: token },
      }
    );
    const paymentSessionId = response.data.paymentSessionId;

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
  } catch (error) {
    console.log({ message: error.message });
  }
});
