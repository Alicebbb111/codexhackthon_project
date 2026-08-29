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

module.exports = { getUserSkillScores, getUserDashboardSummary };
