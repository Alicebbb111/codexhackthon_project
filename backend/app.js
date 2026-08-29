const express = require("express");
const aiRoutes = require("./routes/aiRoutes");
const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/ai", aiRoutes);
app.use("/api/quiz-results", quizRoutes);
app.use("/api", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ error: error.message || "Internal server error." });
});

module.exports = app;
