const { analyzeSkills } = require("./skillAnalysis");
const ai = require("./aiService");

const technical = { Excel: 80, SQL: 40, Python: 20, Statistics: 50, "Data Visualization": 30 };
const soft = { Communication: 80, Teamwork: 70, "Problem Solving": 65 };
const analysis = analyzeSkills(technical, "Data Analyst");
const inputs = {
  profile: { technical_skills: technical, soft_skills: soft, career_readiness: analysis.career_readiness, target_career: "Data Analyst" },
  career: { technical_skills: technical, soft_skills: soft, interests: ["working with data", "finding patterns"], supported_careers: ["Data Analyst", "Business Analyst", "Data Scientist"] },
  path: analysis,
  quiz: { target_skill: "SQL", current_topic: "JOIN", current_assessed_level: "beginner", previous_answers: [], weak_concepts: [] },
  feedback: { question: "Which JOIN keeps every row from the left table?", student_answer: "INNER JOIN", correct_answer: "LEFT JOIN", measured_concept: "SQL JOIN behavior", previous_weak_concepts: [] },
};
const tests = { profile: [ai.interpretSkillProfile, inputs.profile], career: [ai.recommendCareers, inputs.career], path: [ai.generateLearningPath, inputs.path], quiz: [ai.generateAdaptiveQuiz, inputs.quiz], feedback: [ai.generateQuizFeedback, inputs.feedback] };

async function main() {
  const name = process.argv[2];
  if (!tests[name]) throw new Error("Choose one argument: profile, career, path, quiz, or feedback.");
  console.log(JSON.stringify(await tests[name][0](tests[name][1]), null, 2));
}
main().catch(error => { console.error(`AI test failed: ${error.message}`); process.exitCode = 1; });
