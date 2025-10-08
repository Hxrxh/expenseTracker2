const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection.js");

const expenseTable = sequelize.define("expenses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  expenseamount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

module.exports = expenseTable;
