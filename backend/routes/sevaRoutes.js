const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const Devotee = require("../models/Devotee");
const SevaTransaction = require("../models/SevaTransaction");

// @route   POST /api/seva/pledge
// @desc    Submit payment proof for manual verification
router.post("/pledge", protect, async (req, res) => {
  try {
    const { amount, utrNumber } = req.body;
    const pledgeAmount = Number(amount) || 0;
    const trimmedUtr = typeof utrNumber === "string" ? utrNumber.trim() : "";

    if (pledgeAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid seva amount is required.",
      });
    }

    if (trimmedUtr.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Kripya UPI Reference / UTR Number darj karein.",
      });
    }

    const existingUtr = await SevaTransaction.findOne({
      utrNumber: trimmedUtr,
    });
    if (existingUtr) {
      return res.status(400).json({
        success: false,
        message: "Yeh UTR Number pehle se darj kiya ja chuka hai.",
      });
    }

    const transaction = await SevaTransaction.create({
      devotee: req.user._id,
      devoteeName: req.user.name,
      amount: pledgeAmount,
      utrNumber: trimmedUtr,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      message:
        "Aapka payment proof swikaar kar liya gaya hai. Online seva admin bank statement se match karke verify karenge.",
      transaction,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Yeh UTR Number pehle se darj kiya ja chuka hai.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error recording seva proof.",
    });
  }
});

// @route   GET /api/seva/history
// @desc    Get the logged-in devotee's seva payment history
router.get("/history", protect, async (req, res) => {
  try {
    const transactions = await SevaTransaction.find({
      devotee: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error loading seva history.",
    });
  }
});

// @route   GET /api/seva/admin/analytics
// @desc    Admin gets seva request status totals and amounts
router.get("/admin/analytics", protect, adminOnly, async (req, res) => {
  try {
    const analytics = await SevaTransaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const result = {
      pending: { count: 0, amount: 0 },
      verified: { count: 0, amount: 0 },
      rejected: { count: 0, amount: 0 },
    };

    analytics.forEach((entry) => {
      if (result[entry._id]) {
        result[entry._id] = {
          count: entry.count,
          amount: entry.amount,
        };
      }
    });

    res.json({ success: true, analytics: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error loading seva analytics.",
    });
  }
});

// @route   GET /api/seva/admin/pending
// @desc    Admin lists seva submissions awaiting verification
router.get("/admin/pending", protect, adminOnly, async (req, res) => {
  try {
    const transactions = await SevaTransaction.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error loading pending seva.",
    });
  }
});

// @route   POST /api/seva/admin/verify/:id
// @desc    Admin verifies or rejects a seva payment proof
router.post("/admin/verify/:id", protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body;
    const transaction = await SevaTransaction.findById(req.params.id);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Transaction has already been processed.",
      });
    }

    if (action === "approve") {
      transaction.status = "verified";
      await transaction.save();

      await Devotee.findByIdAndUpdate(transaction.devotee, {
        $inc: { totalSevaPledged: transaction.amount },
      });

      return res.json({
        success: true,
        message: "Transaction verified and added to the devotee profile.",
      });
    }

    if (action === "reject") {
      transaction.status = "rejected";
      await transaction.save();
      return res.json({
        success: true,
        message: "Transaction marked as rejected.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Action must be approve or reject.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error processing transaction.",
    });
  }
});

module.exports = router;
