const mongoose = require("mongoose");

const snapshotDevoteeSchema = new mongoose.Schema({
  devoteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Devotee",
  },
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  quizScore: {
    type: Number,
    default: 0,
  },
  dailyCompletedMalas: {
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
  quizTimeTaken: {
    type: Number,
    default: 0, // Time in seconds for tie-breaking
  },
});

const leaderboardSnapshotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      unique: true,
      index: true,
    },
    rankings: [snapshotDevoteeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaderboardSnapshot", leaderboardSnapshotSchema);