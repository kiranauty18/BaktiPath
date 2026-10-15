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
        totalScore: devotee.totalScore,
        quizScore: devotee.quizScore,
        japScore: devotee.japScore,
        completedMalas: devotee.completedMalas,
        lifetimeJap: devotee.lifetimeJap,
        token: generateToken(devotee._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me (Get profile using token)
router.get("/me", protect, async (req, res) => {
  try {
    // req.user was attached by authMiddleware without the password field
    res.status(200).json({
      success: true,
      devotee: req.user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error fetching profile" });
  }
});

module.exports = router;
