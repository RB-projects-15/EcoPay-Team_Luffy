// backend/src/models/Reward.js
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
});

module.exports = mongoose.model("Reward", rewardSchema);
