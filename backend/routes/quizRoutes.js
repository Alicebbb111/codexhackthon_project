const express = require("express");
const controller = require("../controllers/quizController");

const router = express.Router();
router.get("/user/:userId", controller.getUserQuizResults);
router.get("/user/:userId/quiz/:quizId", controller.getUserQuizResult);

module.exports = router;
