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
router.get("/users", adminController.getAllUsers);

module.exports = router;
