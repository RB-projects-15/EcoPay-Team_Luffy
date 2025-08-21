// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);

// Waste Requests
router.post("/waste/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "Only .png/.jpg allowed" });
  res.json({ image_url: `/uploads/${req.file.filename}` });
});

router.post("/waste/submit", userController.submitWaste);

// Transactions
router.get("/transactions/:user_id", userController.getTransactions);

// Rewards
router.post("/rewards/redeem", userController.redeemReward);

// ✅ Get user’s specific request by ID
router.get("/waste/:id", async (req, res) => {
  try {
    const request = await require("../models/WasteRequest").findById(
      req.params.id
    );
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (err) {
    console.error("Error fetching user request:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ Add this route for admin to fetch all users
router.get("/all", userController.getAllUsers);

module.exports = router;
