const express = require("express");
const app = express();
const cors = require("cors");
const userModel = require("./models/userModel");

const db = require("./utils/db-connection");
const paymentRouter = require("./routes/paymentRouter");
const userRouter = require("./routes/userRouter");
const forgotPassRouter = require("./routes/forgotPassRouter");
const premiumRouter = require("./routes/premiumRouter");
const aiRouter = require("./routes/AiRouter");
const path = require("path");
require("./models");
const expenseRouter = require("./routes/expenseRouter");
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/user", userRouter);
app.use("/transaction", expenseRouter);
app.use("/pay", paymentRouter);
app.use("/premium", premiumRouter);
app.use("/getCategory", aiRouter);
app.use("/password", forgotPassRouter);
db.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
