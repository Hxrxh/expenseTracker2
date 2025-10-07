const expenseTable = require("../models/expenseModel");
const userTable = require("../models/userModel");
const paymentTable = require("./payment");

userTable.hasMany(expenseTable);
expenseTable.belongsTo(userTable);

module.exports = {
  expenseTable,
  userTable,
  paymentTable,
};
