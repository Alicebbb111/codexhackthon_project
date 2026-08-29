const express = require("express");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
app.use(express.json());
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/ai", aiRoutes);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({ error: error.message || "Internal server error." });
});

module.exports = app;
