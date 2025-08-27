// backend/src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    points: { type: Number, default: 0 }, // aligns with transactions & rewards
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("User", UserSchema);
