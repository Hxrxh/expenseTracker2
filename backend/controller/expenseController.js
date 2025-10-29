const { Op } = require("sequelize");
const { userTable } = require("../models");
const expenseTable = require("../models/expenseModel");
const sequelize = require("../utils/db-connection");
const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id: userId } = req.user;
    console.log(userId);
    const { amount, desc, category, type } = req.body;

    const addedExpense = await expenseTable.create(
      {
        expenseamount: amount,
        description: desc,
        category: category,
        userId: userId,
        type: type,
      },
      {
        transaction: t,
      }
    );
    if (type == "expense") {
      await userTable.increment(
        { totalExpense: amount },
        {
          where: {
            id: userId,
          },
          transaction: t,
        }
      );
    } else {
      await userTable.increment(
        { totalIncome: amount },
        {
          where: {
            id: userId,
          },
          transaction: t,
        }
      );
    }
    await t.commit();
    res.status(201).json(addedExpense);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
const getExpenseData = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const { id: userId } = req.user;
    const { count, rows: expenseData } = await expenseTable.findAndCountAll({
      where: {
        userId: userId,
      },
      limit,
      offset,
    });
    if (!expenseData) {
      res.status(404).json({ message: "expense Data not found" });
    }
    res.status(200).json({
      expenseData: expenseData,
      currentPage: page,
      totalExpenses: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const user = await userTable.findByPk(userId, { transaction: t });
    const expenseData = await expenseTable.findOne({
      where: {
        id: id,
        userId: userId,
      },
      transaction: t,
    });
    if (expenseData.type == "expense") {
      user.totalExpense -= expenseData.expenseamount;
    } else {
      user.totalIncome -= expenseData.expenseamount;
    }

    await user.save({ transaction: t });
    const deletedData = await expenseTable.destroy({
      where: {
        id: id,
        userId: userId,
      },
      transaction: t,
    });

    await t.commit();
    res.status(200).send("Successfully deleted");
  } catch (error) {
    await t.rollback();
    res.status(500).json({ err: error.message });
  }
};
const getFilteredTransaction = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;
    const now = new Date();
    let startDate, endDate;

    if (type === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1); // Jan 1
      endDate = new Date(now.getFullYear(), 11, 31); // Dec 31
    } else if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === "weekly") {
      const day = now.getDay(); // 0 = Sunday
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day); // Start of this week
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      return res.status(400).json({ message: "Invalid filter type" });
    }

    const expenses = await expenseTable.findAll({
      where: {
        userId,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
module.exports = {
  addExpense,
  getExpenseData,
  getFilteredTransaction,
  deleteExpense,
};
