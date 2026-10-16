const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { startMidnightCron } = require("./cron/dailyMidnightCron"); // 👈 1. Added import

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Midnight Leaderboard Rollover Scheduler
startMidnightCron(); // 👈 2. Called here

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/jap", require("./routes/japRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/seva", require("./routes/sevaRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/bhajans", require("./routes/bhajanRoutes"));

// Test / Health Route
app.get("/", (req, res) => {
  res.send("Radha Krishna Bhaktimarg API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
