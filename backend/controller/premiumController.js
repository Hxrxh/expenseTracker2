const expenseTable = require("../models/expenseModel");
const { fn, col } = require("sequelize");
const userTable = require("../models/userModel");
const getLeaderboardData = async (req, res) => {
  try {
    const userTotalExpense = await userTable.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json({ userTotalExpense });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  getLeaderboardData,
};
