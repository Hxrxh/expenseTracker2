const express = require("express");
const app = express();
const cors = require("cors");
const userModel = require("./models/userModel");
const db = require("./utils/db-connection");
const userRouter = require("./routes/userRouter");

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

db.sync({ alter: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
