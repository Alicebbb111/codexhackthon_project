const { pool } = require("../db");

const PUBLIC_FIELDS = "id, username, name, email, target_career";

async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE email = ? LIMIT 1`, [email]);
  return rows[0] || null;
}

async function findUserByUsername(username) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE username = ? LIMIT 1`, [username]);
  return rows[0] || null;
}

async function createUser({ username, name, email, passwordHash, targetCareer = null }) {
  const [result] = await pool.query(
    "INSERT INTO users (username, name, email, password, target_career) VALUES (?, ?, ?, ?, ?)",
    [username, name, email, passwordHash, targetCareer],
  );
  return getUserById(result.insertId);
}

async function getUserById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

module.exports = { findUserByEmail, findUserByUsername, createUser, getUserById };
