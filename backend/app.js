const express = require("express");
const app = express();
const cors = require("cors");
const userModel = require("./models/userModel");
const db = require("./utils/db-connection");
const userRouter = require("./routes/userRouter");
const expenseRouter = require("./routes/expenseRouter");
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/expense", expenseRouter);
db.sync({ alter: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
