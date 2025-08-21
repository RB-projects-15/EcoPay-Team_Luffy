// backend/src/controllers/adminController.js
const Joi = require("joi");
const WasteRequest = require("../models/WasteRequest");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// ===== Joi Schemas =====
const approveSchema = Joi.object({
  collector_info: Joi.string()
    .pattern(/^Collector\s+[A-Za-z]+(\s+[A-Za-z]+)*\s+-\s+\+91[0-9]{10}$/)
    .message("Collector info must be like: Collector Ram - +919876543210")
    .required(),
});

// ===== Get All Requests =====
exports.getRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Get Requests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Approve Request =====
exports.approveRequest = async (req, res) => {
  try {
    const { error } = approveSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { id } = req.params;
    const { collector_info } = req.body;

    const request = await WasteRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.status !== "pending")
      return res
        .status(400)
        .json({ error: "Request already approved or completed" });

    request.status = "approved";
    request.collector_info = collector_info;
    await request.save();

    res.json({
      message: "Request approved",
      request,
    });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Complete Request =====
exports.completeRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await WasteRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.status !== "approved")
      return res
        .status(400)
        .json({ error: "Request must be approved before completing" });

    request.status = "completed";

    // Award points based on weight (example: 10 points per kg)
    const pointsAwarded = request.weight * 10;

    request.points_awarded = pointsAwarded;
    await request.save();

    // Update user points
    const user = await User.findById(request.user_id);
    if (user) {
      user.points += pointsAwarded;
      await user.save();

      // Save transaction
      const tx = new Transaction({
        user_id: user._id,
        type: "credit",
        points: pointsAwarded,
        description: `Waste submission (${request.waste_type})`,
      });
      await tx.save();
    }

    res.json({
      message: "Request completed and points awarded",
      request,
    });
  } catch (err) {
    console.error("Complete Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
