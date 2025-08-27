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
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("Transaction", TransactionSchema);
