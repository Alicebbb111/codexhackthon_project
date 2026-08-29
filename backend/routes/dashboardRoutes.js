const express = require("express");
const controller = require("../controllers/dashboardController");
const router = express.Router();
router.post("/:userId", controller.saveUserDashboard);
router.get("/:userId", controller.getUserDashboard);
router.get("/:userId/skills", controller.getUserSkillScores);
router.post("/:userId/skills", controller.saveUserSkillScores);
module.exports = router;
