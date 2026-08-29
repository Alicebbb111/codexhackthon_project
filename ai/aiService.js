require("dotenv").config();
const OpenAI = require("openai");
const {
  SKILL_PROFILE_INTERPRETER_SYSTEM_PROMPT, CAREER_RECOMMENDER_SYSTEM_PROMPT,
  PERSONALIZED_LEARNING_PATH_SYSTEM_PROMPT, ADAPTIVE_QUIZ_GENERATOR_SYSTEM_PROMPT,
  PERSONALIZED_QUIZ_FEEDBACK_SYSTEM_PROMPT, buildSkillProfileInterpreterPrompt,
  buildCareerRecommenderPrompt, buildPersonalizedLearningPathPrompt,
  buildAdaptiveQuizGeneratorPrompt, buildPersonalizedQuizFeedbackPrompt,
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

module.exports = { interpretSkillProfile, recommendCareers, generateLearningPath, generateAdaptiveQuiz, generateQuizFeedback, parseJsonResponse };
