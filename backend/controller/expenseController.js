const { userTable } = require("../models");
const expenseTable = require("../models/expenseModel");
const sequelize = require("../utils/db-connection");
const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id: userId } = req.user;
    console.log(userId);
    const { amount, desc, category } = req.body;

    const addedExpense = await expenseTable.create(
      {
        expenseamount: amount,
        description: desc,
        category: category,
        userId: userId,
      },
      {
        transaction: t,
      }
    );
    await userTable.increment(
      { totalExpense: amount },
      {
        where: {
          id: userId,
        },
        transaction: t,
      }
    );
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
    const { id: userId } = req.user;
    const expenseData = await expenseTable.findAll({
      where: {
        userId: userId,
      },
    });
    if (!expenseData) {
      res.status(404).json({ message: "expense Data not found" });
    }
    res.status(200).json(expenseData);
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

    user.totalExpense -= expenseData.expenseamount;
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
module.exports = {
  addExpense,
  getExpenseData,
  deleteExpense,
};
