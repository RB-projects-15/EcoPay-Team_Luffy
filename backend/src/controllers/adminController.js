// backend/src/controllers/adminController.js
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const WasteRequest = require("../models/WasteRequest");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Admin = require("../models/Admin");
const Reward = require("../models/Reward");
const RewardRedemption = require("../models/RewardRedemption");

const JWT_SECRET = process.env.JWT_SECRET || "R1yA$up3rS3cr3tK3y!2025";

// ===== Joi Schemas =====
const approveSchema = Joi.object({
  collector_info: Joi.string()
    .pattern(/^Collector\s+[A-Za-z]+(\s+[A-Za-z]+)*\s+-\s+\+91[0-9]{10}$/)
    .required(),
});

// ===== Admin Register =====
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: { _id: newAdmin._id, name, email, role: "admin" },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Admin Login =====
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Get All Requests =====
const getRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find().populate("user", "name email");
    res.status(200).json({
      success: true,
      message: "Pickup requests fetched successfully",
      requests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Approve Request =====
const approveRequest = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request ID" });
    }

    const { error } = approveSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const request = await WasteRequest.findById(req.params.id);
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Waste request not found" });

    // Update request status and collector info
    request.status = "approved";
    request.collector_info = req.body.collector_info;

    // Calculate collection time (5 hours after submission)
    const collectionTime = new Date(request.createdAt);
    collectionTime.setHours(collectionTime.getHours() + 5);
    request.collection_time = collectionTime;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Waste pickup request approved successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Complete Request =====
const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request ID" });
    }

    // Fetch request and populate user
    const request = await WasteRequest.findById(id).populate("user");
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Waste request not found" });
    }

    // Ensure request is approved before completing
    if (request.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved requests can be marked as completed",
      });
    }

    // Dynamic points calculation based on waste type
    const pointsPerKg = {
      Iron: 45,
      Plastic: 30,
      Paper: 25,
      Glass: 30,
    };
    const points = (pointsPerKg[request.waste_type] || 0) * request.weight;

    // Mark request as completed
    request.status = "completed";
    request.points = points;

    // Use previously set collection_time or set now
    request.collection_time = request.collection_time || new Date();

    await request.save();

    // Credit points via transaction
    const transaction = new Transaction({
      user_id: request.user._id,
      points,
      type: "credit",
      description: "Points credited for completed waste request",
      waste_request_id: request._id, // <--- add this
    });
    await transaction.save();

    // Update user's total points
    request.user.points = (request.user.points || 0) + points;
    await request.user.save();

    res.status(200).json({
      success: true,
      message: "Waste pickup request marked as completed and points credited",
      request: {
        _id: request._id,
        user: request.user._id,
        user_name: request.user_name,
        phone: request.phone,
        waste_type: request.waste_type,
        weight: request.weight,
        location: request.location,
        image_url: request.image_url,
        status: request.status,
        collector_info: request.collector_info,
        collection_time: request.collection_time,
        points: request.points,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Get All Users =====
const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email phone points createdAt updatedAt"
    );
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Reward Management =====

// Get all rewards
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json({
      success: true,
      message: "Rewards fetched successfully",
      rewards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// Create a new reward
const createReward = async (req, res) => {
  try {
    const { name, points_required, description } = req.body;
    if (!name || !points_required) {
      return res.status(400).json({
        success: false,
        message: "Name and pointsRequired are required",
      });
    }

    const reward = new Reward({ name, points_required, description });
    await reward.save();

    res.status(201).json({
      success: true,
      message: "Reward created successfully",
      reward,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// Update a reward
const updateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reward = await Reward.findByIdAndUpdate(id, updates, { new: true });
    if (!reward)
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });

    res.status(200).json({
      success: true,
      message: "Reward updated successfully",
      reward,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// Delete a reward
const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await Reward.findByIdAndDelete(id);
    if (!reward)
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });

    res.status(200).json({
      success: true,
      message: "Reward deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// ===== Reward Redemption Management =====

// Get all user redemptions
const getAllRedemptions = async (req, res) => {
  try {
    const redemptions = await RewardRedemption.find()
      .populate("user", "name email")
      .populate("reward", "name pointsRequired description");

    res.status(200).json({
      success: true,
      message: "All reward redemptions fetched successfully",
      redemptions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

// Update redemption status
const updateRedemptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      ![
        "pending",
        "out_for_delivery",
        "will_reach_today",
        "completed",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const redemption = await RewardRedemption.findById(id)
      .populate("reward", "name")
      .populate("user", "name email");

    if (!redemption)
      return res.status(404).json({
        success: false,
        message: "Redemption request not found",
      });

    redemption.status = status;

    // If completed, add completedAt timestamp
    if (status === "completed") {
      redemption.completed_at = new Date();
    }

    await redemption.save();

    res.status(200).json({
      success: true,
      message: `Redemption status updated to ${status}`,
      redemption,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  loginAdmin,
  getRequests,
  approveRequest,
  completeRequest,
  getUsers,
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getAllRedemptions,
  updateRedemptionStatus,
};
