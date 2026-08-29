const quizModel = require("../models/quizModel");

function positiveId(value, name) {
  if (!/^\d+$/.test(value) || Number(value) < 1) {
    const error = new Error(`${name} must be a positive integer.`);
    error.status = 400;
    throw error;
  }
  return Number(value);
}

async function getUserQuizResults(req, res, next) {
  try {
    const results = await quizModel.getQuizResultsByUserId(positiveId(req.params.userId, "userId"));
    res.json({ results });
  } catch (error) { next(error); }
}

async function getUserQuizResult(req, res, next) {
  try {
    const result = await quizModel.getQuizResultByUserAndQuiz(
      positiveId(req.params.userId, "userId"), positiveId(req.params.quizId, "quizId"),
    );
    if (!result) return res.status(404).json({ error: "Quiz result not found." });
    res.json(result);
  } catch (error) { next(error); }
}

module.exports = { getUserQuizResults, getUserQuizResult };
