const { pool } = require("../db");

const BASE_SELECT = `
  SELECT r.id AS result_id, r.user_id, r.quiz_id, q.title AS quiz_title,
         r.score, r.total_score, r.completed_at
  FROM user_quiz_results r
  JOIN quizzes q ON r.quiz_id = q.id`;

function mapResult(row) {
  const score = Number(row.score);
  const total = Number(row.total_score);
  return {
    result_id: row.result_id,
    user_id: row.user_id,
    quiz_id: row.quiz_id,
    quiz_title: row.quiz_title,
    score: row.score,
    total_score: row.total_score,
    percentage: total > 0 ? Math.round((score / total) * 10000) / 100 : 0,
    completed_at: row.completed_at,
  };
}

async function getQuizResultsByUserId(userId) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.user_id = ? ORDER BY r.completed_at DESC`, [userId]);
  return rows.map(mapResult);
}

async function getQuizResultByUserAndQuiz(userId, quizId) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.user_id = ? AND r.quiz_id = ? ORDER BY r.completed_at DESC LIMIT 1`, [userId, quizId]);
  return rows.length ? mapResult(rows[0]) : null;
}

module.exports = { getQuizResultsByUserId, getQuizResultByUserAndQuiz };
