const expenseTable = require("../models/expenseModel");

const addExpense = async (req, res) => {
  try {
    const { amount, desc, category } = req.body;
    const addedExpense = await expenseTable.create({
      expenseamount: amount,
      description: desc,
      category: category,
    });
    res.status(201).json(addedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const getExpenseData = async (req, res) => {
  try {
    const expenseData = await expenseTable.findAll();
    if (!expenseData) {
      res.status(404).json({ message: "expense Data not found" });
    }
    res.status(200).json(expenseData);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await expenseTable.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
module.exports = {
  addExpense,
  getExpenseData,
  deleteExpense,
};
