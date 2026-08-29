require("dotenv").config();
const OpenAI = require("openai");
const {
  SKILL_PROFILE_INTERPRETER_SYSTEM_PROMPT, CAREER_RECOMMENDER_SYSTEM_PROMPT,
  PERSONALIZED_LEARNING_PATH_SYSTEM_PROMPT, ADAPTIVE_QUIZ_GENERATOR_SYSTEM_PROMPT,
  PERSONALIZED_QUIZ_FEEDBACK_SYSTEM_PROMPT, buildSkillProfileInterpreterPrompt,
  buildCareerRecommenderPrompt, buildPersonalizedLearningPathPrompt,
  buildAdaptiveQuizGeneratorPrompt, buildPersonalizedQuizFeedbackPrompt,
  ASSESSMENT_QUIZ_SYSTEM_PROMPT, buildAssessmentQuizPrompt,
} = require("./prompts");

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`${name} is required before calling the AI service.`);
  return value.trim();
}

function parseJsonResponse(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("OpenAI returned an empty response; expected valid JSON.");
  try {
    const result = JSON.parse(text);
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("Response JSON must be an object.");
    return result;
  } catch (error) {
    throw new Error(`OpenAI response was not valid JSON: ${error.message}`);
  }
}

async function requestJson(systemPrompt, userPrompt) {
  const client = new OpenAI({ apiKey: required("OPENAI_API_KEY") });
  const response = await client.responses.create({
    model: required("OPENAI_MODEL"), instructions: systemPrompt, input: userPrompt,
    text: { format: { type: "json_object" } },
  });
  return parseJsonResponse(response.output_text);
}

const interpretSkillProfile = input => requestJson(SKILL_PROFILE_INTERPRETER_SYSTEM_PROMPT, buildSkillProfileInterpreterPrompt(input));
const recommendCareers = input => requestJson(CAREER_RECOMMENDER_SYSTEM_PROMPT, buildCareerRecommenderPrompt(input));
const generateLearningPath = input => requestJson(PERSONALIZED_LEARNING_PATH_SYSTEM_PROMPT, buildPersonalizedLearningPathPrompt(input));
const generateAdaptiveQuiz = input => requestJson(ADAPTIVE_QUIZ_GENERATOR_SYSTEM_PROMPT, buildAdaptiveQuizGeneratorPrompt(input));
const generateQuizFeedback = input => requestJson(PERSONALIZED_QUIZ_FEEDBACK_SYSTEM_PROMPT, buildPersonalizedQuizFeedbackPrompt(input));
const generateAssessmentQuiz = async input => {
  const data = await requestJson(ASSESSMENT_QUIZ_SYSTEM_PROMPT, buildAssessmentQuizPrompt(input));
  const skills = Array.isArray(input.skills) ? input.skills : [];
  const allowed = new Set(skills);
  const questions = Array.isArray(data.questions) ? data.questions : [];
  const seen = new Set();
  if (!skills.length || questions.length < skills.length) throw new Error("AI assessment quiz did not cover all requested skills.");
  for (const q of questions) {
    if (!q || !allowed.has(q.skill_name) || !q.question || !Array.isArray(q.choices) || q.choices.length !== 4 || new Set(q.choices).size !== 4 || !Number.isInteger(q.correct_index) || q.correct_index < 0 || q.correct_index > 3) throw new Error("AI assessment quiz contained an invalid question.");
    const key = q.question.trim().toLowerCase(); if (seen.has(key)) throw new Error("AI assessment quiz contained duplicate questions."); seen.add(key);
  }
  if (skills.some(skill => !questions.some(q => q.skill_name === skill))) throw new Error("AI assessment quiz is missing a requested skill.");
  return { questions };
};

module.exports = { interpretSkillProfile, recommendCareers, generateLearningPath, generateAdaptiveQuiz, generateAssessmentQuiz, generateQuizFeedback, parseJsonResponse };
