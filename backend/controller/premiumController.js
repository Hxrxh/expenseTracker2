const expenseTable = require("../models/expenseModel");
const { fn, col } = require("sequelize");
const userTable = require("../models/userModel");
const getLeaderboardData = async (req, res) => {
  try {
    const userTotalExpense = await expenseTable.findAll({
      attributes: ["userId", [fn("SUM", col("expenseamount")), "total"]],
      include: [
        {
          model: userTable,
          attributes: ["name"],
        },
      ],
      group: ["userId", "user.id"],
      order: [[fn("SUM", col("expenseamount")), "DESC"]],
    });
    res.status(200).json({ userTotalExpense });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  getLeaderboardData,
};
