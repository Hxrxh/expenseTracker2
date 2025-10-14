const expenseTable = require("../models/expenseModel");
const userTable = require("../models/userModel");
const forgotPassReqTable = require("./forgotPasswordRequests");
const paymentTable = require("./payment");

userTable.hasMany(expenseTable);
expenseTable.belongsTo(userTable);

userTable.hasMany(forgotPassReqTable);
forgotPassReqTable.belongsTo(userTable);
module.exports = {
  expenseTable,
  userTable,
  paymentTable,
  forgotPassReqTable,
};
