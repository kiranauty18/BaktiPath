const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Devotee = require("../models/Devotee");

// @route   POST /api/seva/pledge
// @desc    Record a voluntary seva pledge securely
router.post("/pledge", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const pledgeAmount = Number(amount) || 0;
    if (pledgeAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Valid pledge amount is required" });
    }

    const devotee = req.user;

    // Increment seva contributions if tracked in Devotee model
    devotee.totalSevaPledged = (devotee.totalSevaPledged || 0) + pledgeAmount;
    await devotee.save();

    res.status(200).json({
      success: true,
      message: "Seva pledge recorded successfully",
      pledge: {
        devoteeName: devotee.name,
        amount: pledgeAmount,
        totalSevaPledged: devotee.totalSevaPledged,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Server error recording pledge" });
  }
});

module.exports = router;
