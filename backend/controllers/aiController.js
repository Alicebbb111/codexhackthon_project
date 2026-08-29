const {
  interpretSkillProfile,
  recommendCareers,
  generateLearningPath,
  generateAdaptiveQuiz,
  generateAssessmentQuiz,
  generateQuizFeedback,
} = require("../../ai/aiService");
const { analyzeSkills } = require("../../ai/skillAnalysis");

function body(req) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    const error = new Error("Request body must be a JSON object.");
    error.status = 400;
    throw error;
  }
  return req.body;
}

const handle = fn => async (req, res, next) => {
  try { res.json(await fn(body(req))); } catch (error) { next(error); }
};

const skillProfile = handle(interpretSkillProfile);
const careerRecommendation = handle(recommendCareers);
const learningPath = handle(input => generateLearningPath({
  ...input,
  ...analyzeSkills(input.current_skills, input.target_career || "Data Analyst"),
}));
const adaptiveQuiz = handle(generateAdaptiveQuiz);
const assessmentQuiz = handle(generateAssessmentQuiz);
const quizFeedback = handle(async input => {
  const selected = input.student_answer ?? input.selected_answer;
  const correct = input.correct_answer;
  return generateQuizFeedback({ ...input, is_correct: selected === correct });
});

module.exports = { skillProfile, careerRecommendation, learningPath, adaptiveQuiz, assessmentQuiz, quizFeedback };
