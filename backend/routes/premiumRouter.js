const express = require("express");
const router = express.Router();
const premimumController = require("../controller/premiumController");
router.get("/leaderboard", premimumController.getLeaderboardData);

module.exports = router;
