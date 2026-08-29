require("dotenv").config();
const express = require("express");
const cors = require("cors");

// นำเข้าเฉพาะ Routes ส่วนอื่นๆ ที่ยังจำเป็น (ถ้ามี) แต่ย้าย auth มาไว้ที่นี่แบบเบ็ดเสร็จ
const authRoutes = require("./routes/authRoutes");
const { login } = require("./controllers/loginController");
const aiRoutes = require("./routes/aiRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ==========================================
// รวม Auth Routes (Login / Register) ไว้ที่นี่
// ==========================================
// ระบบสมาชิกจริงจาก MySQL (bcrypt) — ครอบคลุมทุก account ที่สมัคร รวมถึง admin/1234
app.use("/api/auth", authRoutes);
app.post("/api/login", login);
app.post("/api/register", (req, res, next) => { req.url = "/register"; authRoutes(req, res, next); });

// Routes อื่นๆ ของโปรเจกต์
app.use("/api/ai", aiRoutes);
app.use("/api/quiz-results", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ error: error.message || "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SkillBridge AI Server is running on port ${PORT}`));