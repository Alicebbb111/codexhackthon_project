require("dotenv").config();
const express = require("express");
const cors = require("cors");

// นำเข้าเฉพาะ Routes ส่วนอื่นๆ ที่ยังจำเป็น (ถ้ามี) แต่ย้าย auth มาไว้ที่นี่แบบเบ็ดเสร็จ
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
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // ตัวอย่าง Mock data สำหรับทดสอบล็อกอิน (สามารถปรับเปลี่ยนหรือเชื่อม Database ทีหลังได้)
  if (username === "admin" && password === "1234") {
    res.json({
      success: true,
      user: { username: username }
    });
  } else {
    res.status(401).json({
      error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
    });
  }
});

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