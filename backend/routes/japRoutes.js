const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/jap/sync
// @desc    Sync devotee jap sadhana securely
router.post("/sync", protect, async (req, res) => {
  try {
    const { completedMalas, lifetimeJap } = req.body;

    // req.user is guaranteed to exist and be authenticated by protect middleware
    const devotee = req.user;

    const malas = Number(completedMalas) || 0;
    const lifetime = Number(lifetimeJap) || 0;

    // Keep highest sadhana counts
    devotee.completedMalas = Math.max(devotee.completedMalas || 0, malas);
    devotee.lifetimeJap = Math.max(devotee.lifetimeJap || 0, lifetime);
    devotee.japScore = (devotee.completedMalas || 0) * 10;

    // Keep totalScore in sync if present in schema
    if (devotee.quizScore !== undefined) {
      devotee.totalScore = (devotee.quizScore || 0) + (devotee.japScore || 0);
    }

    await devotee.save();

    res.status(200).json({
      message: "Jap sadhana synced successfully",
      devotee: {
        name: devotee.name,
        completedMalas: devotee.completedMalas,
        lifetimeJap: devotee.lifetimeJap,
        japScore: devotee.japScore,
        totalScore: devotee.totalScore,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
