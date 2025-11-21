const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

const userModel = require("./models/userModel");
const morgan = require("morgan");
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
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(
  morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
    stream: logStream,
  })
);
app.use("/user", userRouter);
app.use("/transaction", expenseRouter);
app.use("/pay", paymentRouter);
app.use("/premium", premiumRouter);
app.use("/getCategory", aiRouter);
app.use("/password", forgotPassRouter);

db.sync()
  .then(() => {
    app.listen(process.env.port, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
