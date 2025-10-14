require("dotenv").config();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");
const { forgotPassReqTable } = require("../models");
const userTable = require("../models/userModel");
const bcrypt = require("bcrypt");

let emailAPI = new TransactionalEmailsApi();
// console.log("your brevo api key is:", process.env.YOUR_BREVO_API_KEY);
emailAPI.authentications.apiKey.apiKey = process.env.YOUR_BREVO_API_KEY;

const forgotFunction = async (req, res) => {
  const { email } = req.body;

  try {
    const myForgotPassId = uuidv4();
    const userId = await userTable.findOne({
      where: {
        email: email,
      },
    });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    await forgotPassReqTable.create({
      id: myForgotPassId,
      userId: userId.id,
      isActive: true,
    });

    const resetLink = `http://localhost:3000/password/resetpassword?uuid=${myForgotPassId}`;
    let message = new SendSmtpEmail();
    message.subject = "Forgot your  Password";
    message.htmlContent = `
  <p>Hi,</p>
  <p>Click the link below to reset your password:</p>
  <a href=${resetLink}>Reset Password</a>
  <p>This link expires in 1 hour.</p>
`;
    message.sender = { name: "HarshExpense", email: "harsh209528@gmail.com" };
    message.to = [{ email: `${email}` }];

    const response = await emailAPI.sendTransacEmail(message);

    res
      .status(200)
      .json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const forgotPassId = req.query.uuid;
    const request = await forgotPassReqTable.findByPk(forgotPassId);
    if (request && request.isActive === true) {
      res.sendFile(path.join(__dirname, "../../frontend/updatePass.html"));
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updatePassword = async (req, res) => {
  const { newPass, confirmPass } = req.body;
  const forgotPassId = req.query.uuid;
  try {
    console.log(forgotPassId, confirmPass);
    const forgotReq = await forgotPassReqTable.findByPk(forgotPassId);
    const userId = forgotReq.userId;
    const hash = await bcrypt.hash(confirmPass, 10);
    await userTable.update({ password: hash }, { where: { id: userId } });
    forgotReq.isActive = false; // or false
    await forgotReq.save();

    res.status(200).json({ message: "pass updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { forgotFunction, resetPassword, updatePassword };
