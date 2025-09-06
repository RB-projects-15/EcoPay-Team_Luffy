// backend/src/models/Reward.js
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    points_required: { type: Number, required: true },
    description: { type: String }, // optional description
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Reward", rewardSchema);
