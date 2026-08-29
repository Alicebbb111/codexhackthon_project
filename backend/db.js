require("dotenv").config();
const mysql = require("mysql2/promise");

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`${name} is required for the MySQL connection.`);
  return value.trim();
}

const pool = mysql.createPool({
  host: required("DB_HOST"),
  port: Number(required("DB_PORT")),
  user: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1 AS ok");
    const [tables] = await connection.query("SHOW TABLES");
    return { database: required("DB_NAME"), tables: tables.map(row => Object.values(row)[0]) };
  } catch (error) {
    throw new Error(`MySQL connection check failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { pool, checkDatabaseConnection };
