// backend/src/controllers/adminController.js
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const WasteRequest = require("../models/WasteRequest");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Admin = require("../models/Admin");

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
    const requests = await WasteRequest.find().populate(
      "user_id",
      "name email"
    );
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

    request.status = "approved";
    request.collector_info = req.body.collector_info;
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request ID" });
    }

    const request = await WasteRequest.findById(req.params.id).populate(
      "user_id"
    );
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Waste request not found" });

    request.status = "completed";
    await request.save();

    // Handle points
    const points = Number(req.body.points) || 0;

    const transaction = new Transaction({
      user: request.user_id._id,
      request: request._id,
      points,
      description: "Completed waste request",
    });
    await transaction.save();

    request.user_id.points = (request.user_id.points || 0) + points;
    await request.user_id.save();

    res.status(200).json({
      success: true,
      message: "Waste pickup request completed and points credited",
      request,
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
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email phone points createdAt updatedAt"
    );
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

module.exports = {
  register,
  loginAdmin,
  getRequests,
  approveRequest,
  completeRequest,
  getAllUsers,
};
