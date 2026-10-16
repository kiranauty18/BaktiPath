const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Devotee = require("../models/Devotee");
const { protect } = require("../middleware/authMiddleware");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const devoteeExists = await Devotee.findOne({ email: email.toLowerCase() });
    if (devoteeExists) {
      return res
        .status(400)
        .json({ message: "Devotee with this email already registered" });
    }

    const devotee = await Devotee.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      _id: devotee._id,
      name: devotee.name,
      email: devotee.email,
      role: devotee.role || "devotee",
      totalScore: devotee.totalScore || 0,
      token: generateToken(devotee._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const devotee = await Devotee.findOne({ email: email.toLowerCase() });

    if (devotee && (await devotee.matchPassword(password))) {
      res.json({
        _id: devotee._id,
        name: devotee.name,
        email: devotee.email,
        role: devotee.role || "devotee",
        totalScore: devotee.totalScore || 0,
        quizScore: devotee.quizScore || 0,
        dailyQuizScore: devotee.dailyQuizScore || 0,
        japScore: devotee.japScore || 0,
        completedMalas: devotee.completedMalas || 0,
        dailyCompletedMalas: devotee.dailyCompletedMalas || 0,
        lifetimeJap: devotee.lifetimeJap || 0,
        token: generateToken(devotee._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handler for fetching devotee profile
const getDevoteeProfile = async (req, res) => {
  try {
    const devotee = await Devotee.findById(req.user._id).select("-password");
    if (!devotee) {
      return res
        .status(404)
        .json({ success: false, message: "Devotee not found" });
    }

    res.status(200).json({
      success: true,
      devotee: {
        _id: devotee._id,
        name: devotee.name,
        email: devotee.email,
        role: devotee.role || "devotee",
        completedMalas: devotee.completedMalas || 0,
        dailyCompletedMalas:
          devotee.dailyCompletedMalas ||
          (devotee.japScore ? devotee.japScore / 5 : 0),
        lifetimeJap: devotee.lifetimeJap || 0,
        japScore: devotee.japScore || 0,
        quizScore: devotee.quizScore || 0,
        dailyQuizScore: devotee.dailyQuizScore || 0,
        totalScore:
          devotee.totalScore ||
          (devotee.japScore || 0) + (devotee.dailyQuizScore || 0),
        totalSevaPledged: devotee.totalSevaPledged || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Registered on both endpoints to ensure backward and frontend route compatibility
// @route   GET /api/auth/me
router.get("/me", protect, getDevoteeProfile);

// @route   GET /api/auth/profile
router.get("/profile", protect, getDevoteeProfile);

module.exports = router;
