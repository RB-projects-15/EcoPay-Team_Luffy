const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ===== Admin Routes =====

// Get all requests
router.get("/requests", adminController.getRequests);

// Approve a request by ID
router.post("/requests/:id/approve", adminController.approveRequest);

// Complete a request by ID
router.post("/requests/:id/complete", adminController.completeRequest);

module.exports = router;
