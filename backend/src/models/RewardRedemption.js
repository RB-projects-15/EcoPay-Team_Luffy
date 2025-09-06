// backend/src/models/RewardRedemption.js
const mongoose = require("mongoose");

const rewardRedemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "out_for_delivery", "will_reach_today", "completed"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }, // filled when status is 'completed'
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("RewardRedemption", rewardRedemptionSchema);
