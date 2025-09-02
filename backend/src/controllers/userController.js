const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const WasteRequest = require("../models/WasteRequest");
const Transaction = require("../models/Transaction");

const JWT_SECRET = process.env.JWT_SECRET || "R1yA$up3rS3cr3tK3y!2025";

// ===== User Registration =====
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // ✅ Check required fields
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, email, phone, password, confirmPassword) are required",
      });
    }

    // ✅ Password confirmation check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ===== User Login =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ===== Submit Waste Request =====
exports.submitWaste = async (req, res) => {
  try {
    const { waste_type, weight, location, phone } = req.body;

    // Check if image is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Waste image is required" });
    }

    // Get logged-in user info
    const user = await User.findById(req.user.id).select("name");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Waste points mapping (for later calculation)
    const pointsPerKg = {
      Iron: 45,
      Plastic: 30,
      Paper: 25,
      Glass: 30,
    };

    // Validate waste type
    if (!pointsPerKg[waste_type]) {
      return res.status(400).json({
        success: false,
        message: "Invalid waste type provided",
      });
    }

    // Store waste request WITHOUT awarding points
    const wasteRequest = new WasteRequest({
      user: req.user.id,
      user_name: user.name,
      phone,
      waste_type,
      weight,
      location,
      image_url: `/uploads/${req.file.filename}`,
      status: "pending", // ✅ default status
    });

    await wasteRequest.save();

    res.status(201).json({
      success: true,
      message:
        "Waste request submitted successfully. Points will be awarded after completion.",
      wasteRequest,
    });
  } catch (error) {
    console.error("Submit Waste Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

// ===== Get Transactions =====
exports.getTransactions = async (req, res) => {
  try {
    // Fetch transactions for the logged-in user and populate related waste request
    const transactions = await Transaction.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .lean(); // lean() for plain JS objects

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this user",
      });
    }

    // Fetch related waste requests for 'Completed waste request' transactions
    const wasteRequestIds = transactions
      .filter((tx) => tx.description.includes("Waste request"))
      .map((tx) => tx.waste_request_id)
      .filter(Boolean);

    let wasteRequestsMap = {};
    if (wasteRequestIds.length) {
      const wasteRequests = await WasteRequest.find({
        _id: { $in: wasteRequestIds },
      }).lean();

      wasteRequestsMap = wasteRequests.reduce((acc, wr) => {
        acc[wr._id] = wr;
        return acc;
      }, {});
    }

    // Attach waste request details to transactions
    const detailedTransactions = transactions.map((tx) => ({
      ...tx,
      waste_request: tx.waste_request_id
        ? wasteRequestsMap[tx.waste_request_id]
        : null,
    }));

    res.json({
      success: true,
      message: "Transactions fetched successfully",
      transactions: detailedTransactions,
    });
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message,
    });
  }
};

// ===== Get Available Rewards =====
exports.getRewards = async (req, res) => {
  try {
    // For now, let's use static rewards. Later, you can fetch from DB
    const rewards = [
      {
        reward_id: "64fa9creward123",
        name: "EcoCup",
        points_required: 50,
        description: "Reusable cup for eco-friendly usage",
      },
      {
        reward_id: "64fa9creward124",
        name: "Plant a Tree",
        points_required: 100,
        description: "Plant a tree in your local area",
      },
    ];

    res.status(200).json({
      success: true,
      message: "Rewards fetched successfully",
      rewards,
    });
  } catch (err) {
    console.error("Get Rewards Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ===== Redeem Reward =====

exports.redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reward_id } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const rewardPoints = 50; // fixed points for now
    if ((user.points || 0) < rewardPoints)
      return res
        .status(400)
        .json({ success: false, message: "Not enough points to redeem" });

    // Deduct points
    user.points -= rewardPoints;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      user_id: user._id, // ⚡ correct field
      type: "debit",
      points: rewardPoints,
      description: `Redeemed reward (${reward_id})`,
    });
    await transaction.save();

    res.json({
      success: true,
      message: "Reward redeemed successfully",
      user: { _id: user._id, name: user.name, points: user.points },
      transaction,
    });
  } catch (err) {
    console.error("Redeem Reward Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ===== Get All Requests for Logged-in User =====
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    if (!requests.length) {
      return res.status(404).json({
        success: false,
        message: "No waste requests found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Waste requests fetched successfully",
      requests,
    });
  } catch (err) {
    console.error("Get My Requests Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message,
    });
  }
};
// ===== Get User Profile =====
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email phone points createdAt updatedAt"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message,
    });
  }
};
