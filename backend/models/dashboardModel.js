const { pool } = require("../db");

async function getUserSkillScores(userId) {
  const [rows] = await pool.query(
    `SELECT us.skill_id, s.skill_name, s.skill_type, us.score
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = ?
     ORDER BY s.skill_type, s.skill_name`,
    [userId],
  );
  return rows;
}

async function getUserDashboardSummary(userId) {
  const [rows] = await pool.query(
    `SELECT u.target_career, d.technical_score_avg, d.soft_score_avg,
            d.readiness_score_avg, d.recommended_career,
            d.market_match_percentage
     FROM users u
     LEFT JOIN user_dashboards d ON d.user_id = u.id
     WHERE u.id = ?
     ORDER BY d.updated_at DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0] || null;
}

async function upsertUserDashboard(userId, dashboardData) {
  const { technicalScore, softScore, readinessScore, recommendedCareer, marketMatch } = dashboardData;
  const [existing] = await pool.query(
    "SELECT id FROM user_dashboards WHERE user_id = ? ORDER BY updated_at DESC, id DESC LIMIT 1",
    [userId],
  );
  if (existing.length) {
    await pool.query(
      `UPDATE user_dashboards SET technical_score_avg = ?, soft_score_avg = ?,
       readiness_score_avg = ?, recommended_career = ?, market_match_percentage = ?
       WHERE id = ?`,
      [technicalScore, softScore, readinessScore, recommendedCareer, marketMatch, existing[0].id],
    );
  } else {
    await pool.query(
      `INSERT INTO user_dashboards
       (user_id, technical_score_avg, soft_score_avg, readiness_score_avg, recommended_career, market_match_percentage)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, technicalScore, softScore, readinessScore, recommendedCareer, marketMatch],
    );
  }
  return getUserDashboardSummary(userId);
}

async function upsertUserSkill(userId, skillId, score) {
  await pool.query(
    `INSERT INTO user_skills (user_id, skill_id, score) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score), updated_at = CURRENT_TIMESTAMP`,
    [userId, skillId, score],
  );
}

async function upsertUserSkills(userId, skills) {
  const ids = skills.map(skill => skill.skill_id);
  if (ids.length) {
    const [rows] = await pool.query("SELECT id FROM skills WHERE id IN (?)", [ids]);
    if (rows.length !== new Set(ids).size) { const error = new Error("One or more skill IDs do not exist."); error.status = 400; throw error; }
  }
  for (const skill of skills) await upsertUserSkill(userId, skill.skill_id, skill.score);
  return getUserSkillScores(userId);
}

module.exports = { getUserSkillScores, getUserDashboardSummary, upsertUserDashboard, upsertUserSkill, upsertUserSkills };
