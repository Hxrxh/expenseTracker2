const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: process.env.DIALECT,
  }
);

async () => {
  try {
    await sequelize.authenticate();
    console.log("connection is established");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sequelize;
