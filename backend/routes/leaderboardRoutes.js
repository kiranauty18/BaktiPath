const express = require("express");
const router = express.Router();
const Devotee = require("../models/Devotee");

router.get("/", async (req, res) => {
  try {
    // Fetch real devotees sorted by totalScore or weeklyScore
    const devotees = await Devotee.find({})
      .select("name totalScore quizScore completedMalas weeklyScore")
      .sort({ totalScore: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, devotees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
