const mongoose = require("mongoose");

const singleQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
});

const langContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      explanation: { type: String, default: "" },
    },
  ],
});

const kathaSchema = new mongoose.Schema(
  {
    scheduledDate: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: "" },
    questions: [singleQuestionSchema],
    languages: {
      hi: langContentSchema,
      en: langContentSchema,
      mr: langContentSchema,
      sa: langContentSchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Katha", kathaSchema);
