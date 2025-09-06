const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const WasteRequest = require("../models/WasteRequest");
const Transaction = require("../models/Transaction");
const Reward = require("../models/Reward"); // NEW
const RewardRedemption = require("../models/RewardRedemption"); // NEW

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

    // === Fetch related rewards for debit transactions ===
    const rewardIds = transactions
      .filter((tx) => tx.description.includes("Redeemed reward"))
      .map((tx) => tx.reward_id)
      .filter(Boolean);

    let rewardsMap = {};
    if (rewardIds.length) {
      const rewards = await Reward.find({ _id: { $in: rewardIds } })
        .select("_id name  points_required")
        .lean();

      rewardsMap = rewards.reduce((acc, r) => {
        acc[r._id] = r;
        return acc;
      }, {});
    }

    // Attach waste request or reward details
    const detailedTransactions = transactions.map((tx) => ({
      ...tx,
      waste_request: tx.waste_request_id
        ? wasteRequestsMap[tx.waste_request_id] || null
        : null,
      reward: tx.reward_id ? rewardsMap[tx.reward_id] || null : null,
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

// ===== Get Available Rewards (from DB) =====
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .select("_id name points_required description ") // 👈 include image
      .lean();

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
      error: err.message,
    });
  }
};

// ===== Redeem Reward (Create Redemption Request) =====
exports.redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reward_id } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const reward = await Reward.findById(reward_id);
    if (!reward)
      return res
        .status(404)
        .json({ success: false, message: "Reward not found" });

    if ((user.points || 0) < reward.points_required) {
      return res.status(400).json({
        success: false,
        message: "Not enough points to redeem this reward",
      });
    }

    // ✅ Deduct points
    user.points -= reward.points_required;
    await user.save();

    // ✅ Create redemption request (status: pending)
    const redemption = new RewardRedemption({
      user: userId,
      reward: reward_id,
      status: "pending",
      requested_at: new Date(),
    });
    await redemption.save();

    // ✅ Create a debit transaction
    const transaction = new Transaction({
      user_id: userId,
      type: "debit",
      points: reward.points_required,
      description: `Redeemed reward: ${reward.name}`,
      reward_id: reward._id,
    });
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Reward redemption request submitted",
      redemption: {
        _id: redemption._id,
        reward_id: reward._id,
        status: redemption.status,
        requested_at: redemption.requested_at,
      },
      transaction, // 👈 return transaction info too
    });
  } catch (err) {
    console.error("Redeem Reward Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ===== Get All Reward Redemptions of Logged-in User =====
exports.getRedemptions = async (req, res) => {
  try {
    const redemptions = await RewardRedemption.find({ user: req.user.id })
      .populate("reward", "name points_required description ") // 👈 include image
      .sort({ requested_at: -1 })
      .lean();

    if (!redemptions.length) {
      return res
        .status(404)
        .json({ success: false, message: "No reward redemptions found" });
    }

    // Map response
    const formattedRedemptions = redemptions.map((r) => ({
      _id: r._id,
      reward_name: r.reward.name,
      points_used: r.reward.points_required,
      status: r.status,
      requested_at: r.requested_at,
      completed_at: r.completed_at || null,
    }));

    res.status(200).json({
      success: true,
      redemptions: formattedRedemptions,
    });
  } catch (err) {
    console.error("Get Redemptions Error:", err);
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
