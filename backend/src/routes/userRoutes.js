// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const WasteRequest = require("../models/WasteRequest");
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController"); // ✅ Add this

const {
  register,
  login,
  submitWaste,
  getTransactions,
  getRewards, // list all rewards
  redeemReward, // create redemption request
  getRedemptions, // get all redemptions of logged-in user
  getProfile, // 👈 import the new controller
} = require("../controllers/userController");

const { authMiddleware } = require("../middlewares/authMiddleware");

// ----------------- PUBLIC ROUTES -----------------
router.post("/register", register);
router.post("/login", login);

// ----------------- USER-PROTECTED ROUTES -----------------
router.use(authMiddleware); // 🔒 All routes below need JWT

// ✅ Submit waste request with file upload (points calculated dynamically in controller)
router.post("/waste/submit", upload.single("image"), submitWaste);

// Get user transactions (from JWT, no need user_id in params)
router.get("/transactions", authMiddleware, getTransactions);

//----------------- REWARDS -----------------
// List all rewards (read-only)
router.get("/rewards/all", getRewards);

// Redeem a reward (creates redemption request with pending status)
router.post("/rewards/redeem/create", redeemReward);

// Get all reward redemption requests of logged-in user
router.get("/rewards/redemptions/my", getRedemptions);

// Get all requests of logged-in user
router.get("/my-requests", authMiddleware, userController.getMyRequests);

// Get specific waste request by ID
router.get("/waste/:id", async (req, res) => {
  try {
    const request = await WasteRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.json({ success: true, wasteRequest: request });
  } catch (err) {
    console.error("Error fetching user request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Add new profile route
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
