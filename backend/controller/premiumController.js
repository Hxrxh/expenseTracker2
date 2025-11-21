const expenseTable = require("../models/expenseModel");
const AWS = require("aws-sdk");
const { fn, col } = require("sequelize");
const uploadtoS3 = require("../services/s3-services");
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

async function downloadExpenseData(req, res) {
  try {
    const userId = req.user.id;
    const user = await userTable.findByPk(userId);
    if (!user.isPremium) {
      return res.status(403).json({ message: "User is not premium" });
    } else {
      const expenses = await expenseTable.findAll({ where: { userId } });
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `Expense${userId}/${new Date()}.txt`;
      const fileURL = await uploadtoS3(stringifiedExpenses, filename);
      res.status(200).json({ fileURL, success: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to download expenses", error });
  }
}
module.exports = {
  getLeaderboardData,
  downloadExpenseData,
};
