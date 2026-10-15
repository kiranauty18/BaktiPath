const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { protect } = require("../middleware/authMiddleware");

// Helper to get local date string YYYY-MM-DD
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to calculate ISO-8601 week string (e.g., "2026-W42")
const getCurrentWeekTag = () => {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

// @route   GET /api/quiz/today
// @desc    Fetch today's questions, checking if user has remaining attempts (max 2)
router.get("/today", protect, async (req, res) => {
  try {
    const today = getTodayDateString();
    const devotee = req.user;

    const attemptsToday =
      devotee.lastQuizDate === today ? devotee.dailyQuizAttempts || 0 : 0;

    if (attemptsToday >= 2) {
      return res.json({
        success: true,
        limitReached: true,
        attemptsLeft: 0,
        attemptsUsed: attemptsToday,
        date: today,
        bestScoreToday: devotee.dailyQuizBestScore || 0,
        message:
          "Aapne aaj ke dono (2) attempts purna kar liye hain. Naye prashno ke sath kal punah prastut hoyein!",
      });
    }

    let questions = await Question.find({ scheduledDate: today })
      .select("-correctIndex")
      .lean();

    let isFallback = false;

    if (!questions || questions.length === 0) {
      isFallback = true;
      questions = await Question.aggregate([
        { $match: { scheduledDate: { $lte: today } } },
        { $sample: { size: 5 } },
        { $project: { correctIndex: 0 } },
      ]);

      if (!questions || questions.length === 0) {
        questions = await Question.aggregate([
          { $sample: { size: 5 } },
          { $project: { correctIndex: 0 } },
        ]);
      }
    }

    res.json({
      success: true,
      limitReached: false,
      attemptsLeft: 2 - attemptsToday,
      attemptsUsed: attemptsToday,
      bestScoreToday:
        devotee.lastQuizDate === today ? devotee.dailyQuizBestScore || 0 : 0,
      date: today,
      count: questions.length,
      isFallback,
      questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit answers, record max score between the 2 attempts, and update leaderboard points
router.post("/submit", protect, async (req, res) => {
  try {
    const today = getTodayDateString();
    const currentWeek = getCurrentWeekTag();
    const devotee = req.user;

    // Check if new day: reset attempt count & daily best score
    const isNewDay = devotee.lastQuizDate !== today;
    let currentAttempts = isNewDay ? 0 : devotee.dailyQuizAttempts || 0;
    let prevBestScoreToday = isNewDay ? 0 : devotee.dailyQuizBestScore || 0;

    if (currentAttempts >= 2) {
      return res.status(400).json({
        success: false,
        message: "Aap aaj ke sabhi attempts (2) upyog kar chuke hain.",
      });
    }

    // Validate payload
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid submission format" });
    }

    // Calculate score of THIS attempt
    let thisAttemptScore = 0;
    const questionIds = answers.map((a) => a.questionId);
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });

    const questionMap = new Map();
    dbQuestions.forEach((q) => questionMap.set(q._id.toString(), q));

    answers.forEach((ans) => {
      const q = questionMap.get(ans.questionId);
      if (q && q.correctIndex === ans.selectedIndex) {
        thisAttemptScore += 10;
      }
    });

    // Reset weekly scores if week rolled over
    if (devotee.lastActiveWeek !== currentWeek) {
      devotee.weeklyScore = 0;
      devotee.weeklyQuizScore = 0;
      devotee.weeklyJapScore = 0;
      devotee.lastActiveWeek = currentWeek;
    }

    // Calculate incremental score (only add points if this attempt exceeds previous best)
    let pointsToAdd = 0;
    let newBestScoreToday = prevBestScoreToday;

    if (thisAttemptScore > prevBestScoreToday) {
      pointsToAdd = thisAttemptScore - prevBestScoreToday;
      newBestScoreToday = thisAttemptScore;
    }

    // Apply incremental score to weekly and lifetime aggregates
    if (pointsToAdd > 0) {
      devotee.weeklyQuizScore = (devotee.weeklyQuizScore || 0) + pointsToAdd;
      devotee.weeklyScore = (devotee.weeklyScore || 0) + pointsToAdd;

      devotee.quizScore = (devotee.quizScore || 0) + pointsToAdd;
      devotee.totalScore = (devotee.totalScore || 0) + pointsToAdd;
    }

    // Increment attempts and update tracking fields
    currentAttempts += 1;
    devotee.dailyQuizAttempts = currentAttempts;
    devotee.dailyQuizBestScore = newBestScoreToday;
    devotee.lastQuizDate = today;

    await devotee.save();

    res.json({
      success: true,
      thisAttemptScore,
      bestScoreToday: newBestScoreToday,
      pointsAddedToLeaderboard: pointsToAdd,
      totalQuizScore: devotee.quizScore,
      weeklyScore: devotee.weeklyScore,
      attemptsUsed: currentAttempts,
      attemptsLeft: 2 - currentAttempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
