// backend/src/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");
const WasteRequest = require("../models/WasteRequest");
const Transaction = require("../models/Transaction");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// ===== Joi Schemas =====
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
  phone: Joi.string()
    .pattern(/^\+91[0-9]{10}$/) // ✅ Only +91 followed by 10 digits
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const wasteSchema = Joi.object({
  user_id: Joi.string().required(),
  waste_type: Joi.string()
    .valid("Plastic", "Paper", "Glass", "Organic")
    .required(),
  weight: Joi.number().positive().required(),
  location: Joi.string().required(),
  image_url: Joi.string().allow(null, ""),
});

// ===== Register =====
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, phone } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, phone });
    await user.save();

    res.json({ message: "User registered successfully", user_id: user._id });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Login =====
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user_id: user._id, role: user.role });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Submit Waste Pickup Request =====
exports.submitWaste = async (req, res) => {
  try {
    const { error } = wasteSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { user_id, waste_type, weight, location, image_url } = req.body;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const request = new WasteRequest({
      user_id: user._id,
      user_name: user.name,
      phone: user.phone, // ✅ Auto attach phone from User
      waste_type,
      weight,
      location,
      image_url,
    });

    await request.save();

    res.json({
      message: "Waste pickup request submitted successfully",
      request_id: request._id,
    });
  } catch (err) {
    console.error("Waste Submit Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Get User Transactions =====
exports.getTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const tx = await Transaction.find({ user_id }).sort({ createdAt: -1 });
    res.json(tx);
  } catch (err) {
    console.error("Transactions Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Redeem Reward =====
exports.redeemReward = async (req, res) => {
  try {
    const { user_id, reward_id } = req.body;

    const rewards = [
      { id: "r1", name: "Reusable Bag", cost: 100 },
      { id: "r2", name: "Coffee Mug", cost: 250 },
    ];

    const reward = rewards.find((r) => r.id === reward_id);
    if (!reward) return res.status(400).json({ error: "Invalid reward" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.points < reward.cost)
      return res.status(400).json({ error: "Not enough points" });

    user.points -= reward.cost;
    await user.save();

    const tx = new Transaction({
      user_id,
      type: "debit",
      points: reward.cost,
      description: `Redeemed ${reward.name}`,
    });
    await tx.save();

    res.json({ message: "Reward redeemed successfully" });
  } catch (err) {
    console.error("Redeem Reward Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ===== Get All Users (Admin only) =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
