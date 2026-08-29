const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

// POST /api/auth/login — ตรวจ username + password แล้วคืนข้อมูล user (ไม่ส่งรหัสผ่านกลับ)
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // ดึง hash รหัสผ่านจากฐานข้อมูลเพื่อเทียบ
    const [rows] = await require("../db").pool.query(
      "SELECT id, username, name, email, target_career, password FROM users WHERE username = ? LIMIT 1",
      [username.trim()],
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const { password: _pw, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login };
