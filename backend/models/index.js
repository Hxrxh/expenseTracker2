const expenseTable = require("../models/expenseModel");
const userTable = require("../models/userModel");

userTable.hasMany(expenseTable);
expenseTable.belongsTo(userTable);

module.exports = {
  expenseTable,
  userTable,
};
