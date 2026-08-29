const dashboardModel = require("../models/dashboardModel");

function userId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) { const e = new Error("userId must be a positive integer."); e.status = 400; throw e; }
  return Number(value);
}
function score(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) { const e = new Error(`${field} must be a number between 0 and 100.`); e.status = 400; throw e; }
  return value;
}

async function saveUserDashboard(req, res, next) {
  try {
    const b = req.body || {};
    const recommendedCareer = b.recommended_career == null ? null : b.recommended_career;
    if (recommendedCareer !== null && (typeof recommendedCareer !== "string" || recommendedCareer.trim().length > 150)) { const e = new Error("recommended_career must be a string of 150 characters or fewer."); e.status = 400; throw e; }
    const summary = await dashboardModel.upsertUserDashboard(userId(req.params.userId), { technicalScore: score(b.technical_score_avg, "technical_score_avg"), softScore: score(b.soft_score_avg, "soft_score_avg"), readinessScore: score(b.readiness_score_avg, "readiness_score_avg"), recommendedCareer: recommendedCareer ? recommendedCareer.trim() : null, marketMatch: score(b.market_match_percentage, "market_match_percentage") });
    res.json(summary);
  } catch (error) { next(error); }
}

async function getUserDashboard(req, res, next) {
  try { const summary = await dashboardModel.getUserDashboardSummary(userId(req.params.userId)); if (!summary) return res.status(404).json({ error: "Dashboard not found." }); res.json(summary); } catch (error) { next(error); }
}

async function getUserSkillScores(req, res, next) {
  try { const rows = await dashboardModel.getUserSkillScores(userId(req.params.userId)); res.json({ skills: rows }); } catch (error) { next(error); }
}

async function saveUserSkillScores(req, res, next) {
  try {
    const id = userId(req.params.userId);
    if (!Array.isArray(req.body && req.body.skills)) return res.status(400).json({ error: "skills must be an array." });
    for (const skill of req.body.skills) {
      if (!Number.isInteger(skill.skill_id) || skill.skill_id < 1 || typeof skill.score !== "number" || !Number.isFinite(skill.score) || skill.score < 0 || skill.score > 100) return res.status(400).json({ error: "Each skill must have a positive skill_id and score from 0 to 100." });
    }
    const rows = await dashboardModel.upsertUserSkills(id, req.body.skills);
    res.json({ skills: rows });
  } catch (error) { next(error); }
}

module.exports = { saveUserDashboard, getUserDashboard, getUserSkillScores, saveUserSkillScores };
