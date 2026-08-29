const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

async function register(req, res, next) {
  try {
    const { username, name, email, password, target_career: targetCareer = null } = req.body || {};
    if (typeof username !== "string" || !username.trim()) return res.status(400).json({ error: "Username is required." });
    if (username.trim().length > 50) return res.status(400).json({ error: "Username must be 50 characters or fewer." });
    if (typeof name !== "string" || !name.trim()) return res.status(400).json({ error: "Name is required." });
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ error: "A valid email is required." });
    if (typeof password !== "string" || password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
    if (targetCareer !== null && (typeof targetCareer !== "string" || !targetCareer.trim())) return res.status(400).json({ error: "Target career must be a non-empty string or null." });

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (await userModel.findUserByUsername(cleanUsername)) return res.status(409).json({ error: "Username already exists." });
    if (await userModel.findUserByEmail(cleanEmail)) return res.status(409).json({ error: "Email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.createUser({ username: cleanUsername, name: name.trim(), email: cleanEmail, passwordHash, targetCareer: targetCareer ? targetCareer.trim() : null });
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Username or email already exists." });
    return next(error);
  }
}

module.exports = { register };
