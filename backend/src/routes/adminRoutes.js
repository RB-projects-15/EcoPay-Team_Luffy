// backend/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

// ----------------- PUBLIC ROUTES -----------------

// Admin registration
router.post("/register", adminController.register);

// Admin login
router.post("/login", adminController.loginAdmin);

// ----------------- ADMIN-PROTECTED ROUTES -----------------
router.use(adminMiddleware); // 🔒 ADMIN token required

// Waste request management
router.get("/requests", adminController.getRequests);
router.post("/requests/:id/approve", adminController.approveRequest);
router.post("/requests/:id/complete", adminController.completeRequest);

// User management
router.get("/users", adminController.getUsers);

// ----------------- REWARDS -----------------
// Get all rewards
router.get("/rewards/all", adminController.getRewards);

// Create a new reward
router.post("/rewards/create", adminController.createReward);

// Update a reward by ID
router.put("/rewards/update/:id", adminController.updateReward);

// Delete a reward by ID
router.delete("/rewards/delete/:id", adminController.deleteReward);

// Get all user reward redemptions
router.get("/rewards/redemptions/all", adminController.getAllRedemptions);

// Update a redemption status by ID
router.put("/rewards/redemptions/:id", adminController.updateRedemptionStatus);
module.exports = router;
