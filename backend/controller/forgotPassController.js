const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

require("dotenv").config();
let emailAPI = new TransactionalEmailsApi();

emailAPI.authentications.apiKey.apiKey = process.env.YOUR_BREVO_API_KEY;

const forgotFunction = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    console.log("forgot func called");
    let message = new SendSmtpEmail();
    message.subject = "Forgot your  Password";
    message.textContent =
      "Hi to change your password put this otp in side the form";
    message.sender = { name: "HarshExpense", email: "harsh209528@gmail.com" };
    message.to = [{ email: `${email}` }];
    console.log(message);
    const response = await emailAPI.sendTransacEmail(message);
    console.log(response);
    res
      .status(200)
      .json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { forgotFunction };
