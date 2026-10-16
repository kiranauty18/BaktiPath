const mongoose = require("mongoose");

const languageContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctIndex: { type: Number, required: true },
      explanation: { type: String, default: "" },
    },
  ],
});

const dailyKathaSchema = new mongoose.Schema(
  {
    scheduledDate: {
      type: String,
      required: true,
      unique: true, // "YYYY-MM-DD"
    },
    mediaUrl: { type: String, default: "" },
    // बहुभाषी डेटा मैप: hi, en, mr, sa
    languages: {
      hi: languageContentSchema,
      en: languageContentSchema,
      mr: languageContentSchema,
      sa: languageContentSchema,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyKatha", dailyKathaSchema);