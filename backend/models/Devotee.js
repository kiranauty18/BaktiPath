const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const devoteeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    quizScore: {
      type: Number,
      default: 0,
    },
    japScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    completedMalas: {
      type: Number,
      default: 0,
    },
    lifetimeJap: {
      type: Number,
      default: 0,
    },
    // In DevoteeSchema:
    role: {
      type: String,
      enum: ["devotee", "admin"],
      default: "devotee",
    },
    lastQuizDate: {
      type: String,
      default: null, // e.g. "2026-10-16"
    },
    dailyQuizAttempts: {
      type: Number,
      default: 0,
    },
    weeklyScore: {
      type: Number,
      default: 0,
    },
    weeklyQuizScore: {
      type: Number,
      default: 0,
    },
    weeklyJapScore: {
      type: Number,
      default: 0,
    },
    lastActiveWeek: {
      type: String,
      default: null, // format: "YYYY-Www" (e.g., "2026-W42")
    },
    dailyQuizBestScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Auto-hash password and calculate totalScore before saving
devoteeSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.totalScore = (this.quizScore || 0) + (this.japScore || 0);
});

// Compare password during login
devoteeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Devotee", devoteeSchema);
