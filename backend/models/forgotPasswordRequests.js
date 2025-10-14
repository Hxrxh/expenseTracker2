const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../utils/db-connection");
const { v4: uuidv4 } = require("uuid");
const forgotPassReqTable = sequelize.define("forgotPassReq", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = forgotPassReqTable;
