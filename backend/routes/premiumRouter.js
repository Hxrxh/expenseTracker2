const express = require("express");
const router = express.Router();
const premimumController = require("../controller/premiumController");
const userAuthentication = require("../middleware/auth");
router.get("/leaderboard", premimumController.getLeaderboardData);
router.get(
  "/download",
  userAuthentication.authentication,
  premimumController.downloadExpenseData
);
module.exports = router;
