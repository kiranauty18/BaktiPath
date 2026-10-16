const mongoose = require("mongoose");

const sevaTransactionSchema = new mongoose.Schema(
  {
    devotee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Devotee",
      required: true,
    },
    devoteeName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    utrNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SevaTransaction", sevaTransactionSchema);
