// backend/src/models/WasteRequest.js
const mongoose = require("mongoose");

const WasteRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user_name: { type: String, required: true },
    phone: { type: String, required: true },
    waste_type: {
      type: String,
      enum: ["Plastic", "Paper", "Glass", "Organic"],
      required: true,
    },
    weight: { type: Number, required: true },
    location: { type: String, required: true },
    image_url: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },
    collector_info: { type: String, default: null },
    points_credited: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteRequest", WasteRequestSchema);
