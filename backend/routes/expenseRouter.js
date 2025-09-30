const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expenseController");
const userAuthentication = require("../middleware/auth");
router.post(
  "/",
  userAuthentication.authentication,
  expenseController.addExpense
);
router.get(
  "/",
  userAuthentication.authentication,
  expenseController.getExpenseData
);
router.delete(
  "/:id",
  userAuthentication.authentication,
  expenseController.deleteExpense
);
module.exports = router;
