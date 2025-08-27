// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const WasteRequest = require("../models/WasteRequest");
const upload = require("../middlewares/upload");

const {
  register,
  login,
  submitWaste,
  getTransactions,
  redeemReward,
  getRewards, // <- new
  getProfile, // 👈 import the new controller
} = require("../controllers/userController");

const { authMiddleware } = require("../middlewares/authMiddleware");

// ----------------- PUBLIC ROUTES -----------------
router.post("/register", register);
router.post("/login", login);

// ----------------- USER-PROTECTED ROUTES -----------------
router.use(authMiddleware); // 🔒 All routes below need JWT

// Submit waste request with file upload
router.post("/waste/submit", upload.single("image"), submitWaste);

// Get user transactions (from JWT, no need user_id in params)
router.get("/transactions", authMiddleware, getTransactions);
// Redeem rewards
router.get("/rewards", authMiddleware, getRewards); // list all rewards
router.post("/rewards/redeem", redeemReward);

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
