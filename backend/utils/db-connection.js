const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expense2", "root", "lenovog5012345", {
  host: "localhost",
  dialect: "mysql",
});

async () => {
  try {
    await sequelize.authenticate();
    console.log("connection is established");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sequelize;
