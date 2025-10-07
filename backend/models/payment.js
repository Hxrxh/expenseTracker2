const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../utils/db-connection");

const paymentTable = sequelize.define("payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = paymentTable;
