// backend/src/models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["credit", "debit"], required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },

    // 👇 Optional links for better traceability
    waste_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteRequest",
      default: null,
    },
    reward_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      default: null,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("Transaction", TransactionSchema);
