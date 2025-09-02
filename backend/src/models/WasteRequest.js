// backend/src/models/WasteRequest.js
const mongoose = require("mongoose");

const WasteRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user_name: { type: String, required: true },
    phone: { type: String, required: true },
    waste_type: {
      type: String,
      enum: ["Plastic", "Paper", "Glass", "Iron"], // ✅ Added Iron
      required: true,
    },
    weight: { type: Number, required: true },
    points: { type: Number, default: 0 }, // ✅ renamed points_credited → points
    location: { type: String, required: true },
    image_url: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },
    collector_info: { type: String, default: null },
    collection_time: { type: Date, default: null }, // ✅ New field: time scheduled for collection
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteRequest", WasteRequestSchema);
