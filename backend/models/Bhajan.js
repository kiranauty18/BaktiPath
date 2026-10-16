const mongoose = require("mongoose");

const bhajanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeId: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Bhajan", "Mantra", "Namavali", "Aarti", "Kirtan"],
      default: "Bhajan",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bhajan", bhajanSchema);
