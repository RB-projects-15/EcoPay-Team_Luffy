// backend/src/models/WasteRequest.js
const mongoose = require("mongoose");

const wasteRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_name: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ Store phone with request
    waste_type: {
      type: String,
      enum: ["Plastic", "Paper", "Glass", "Organic"],
      required: true,
    },
    weight: { type: Number, required: true },
    location: { type: String, required: true },
    image_url: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },
    collector_info: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteRequest", wasteRequestSchema);
