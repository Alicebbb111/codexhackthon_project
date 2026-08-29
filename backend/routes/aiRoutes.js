const express = require("express");
const controller = require("../controllers/aiController");

const router = express.Router();
router.post("/skill-profile", controller.skillProfile);
router.post("/career-recommendation", controller.careerRecommendation);
router.post("/learning-path", controller.learningPath);
router.post("/quiz", controller.adaptiveQuiz);
router.post("/quiz-feedback", controller.quizFeedback);

module.exports = router;
