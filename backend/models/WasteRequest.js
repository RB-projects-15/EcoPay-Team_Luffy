const mongoose = require("mongoose");

const wasteRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_name: { type: String, required: true },
    waste_type: { type: String, required: true },
    weight: { type: Number, required: true },
    image_url: { type: String, default: null },

    // 📍 Location details
    location: { type: String, required: true }, // e.g. "Lovely Building, Baina, Vasco, Goa"
    coords: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // ☎️ Contact info
    contact: { type: String, default: null }, // e.g. "+91 9876543210"

    // 📝 Additional notes
    notes: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },

    // 👷 Collector assigned
    collector_info: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteRequest", wasteRequestSchema);
