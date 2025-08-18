/**
 * EcoPay - Backend with Waste Pickup Request Flow (MongoDB Version)
 */
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// ====== MongoDB Connection ======
mongoose
  .connect("mongodb://127.0.0.1:27017/ecopay")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== Multer (PNG/JPG only) ======
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png and .jpg images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// ====== Models ======
const User = require("./models/User");
const WasteRequest = require("./models/WasteRequest");
const Transaction = require("./models/Transaction");

// Rewards (still static in memory)
const rewards = [
  { id: "r1", name: "Reusable Bag", cost: 100 },
  { id: "r2", name: "Coffee Mug", cost: 250 },
];

// ====== Middleware ======
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "Malformed token" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ====== Routes ======

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: "User registered successfully", user_id: user._id });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user_id: user._id });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload Waste Image (PNG/JPG only)
app.post("/api/waste/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Please upload a valid PNG or JPG image" });
  }

  res.json({
    image_url: `/uploads/${req.file.filename}`,
  });
});

// Submit Waste Pickup Request
app.post("/api/waste/submit", async (req, res) => {
  try {
    const {
      user_id,
      waste_type,
      weight,
      image_url,
      location,
      coords,
      contact,
      notes,
    } = req.body;

    if (
      !user_id ||
      !waste_type ||
      typeof weight !== "number" ||
      !location ||
      !contact
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid waste data. Make sure all required fields are provided.",
        });
    }

    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const request = new WasteRequest({
      user_id,
      user_name: user.name,
      waste_type,
      weight,
      image_url: image_url || null,
      location,
      coords,
      contact,
      notes: notes || null,
      status: "pending",
    });

    await request.save();

    res.json({
      message: "Waste pickup request submitted",
      request_id: request._id,
    });
  } catch (err) {
    console.error("Submit Waste Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Submit Waste Pickup Request
app.post("/api/waste/submit", async (req, res) => {
  try {
    const {
      user_id,
      waste_type,
      weight,
      image_url,
      location,
      coords,
      contact,
      notes,
    } = req.body;

    if (
      !user_id ||
      !waste_type ||
      typeof weight !== "number" ||
      !location ||
      !contact
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid waste data. Make sure all required fields are provided.",
        });
    }

    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const request = new WasteRequest({
      user_id,
      user_name: user.name,
      waste_type,
      weight,
      image_url: image_url || null,
      location,
      coords,
      contact,
      notes: notes || null,
      status: "pending",
    });

    await request.save();

    res.json({
      message: "Waste pickup request submitted",
      request_id: request._id,
    });
  } catch (err) {
    console.error("Submit Waste Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all waste pickup requests (Admin)
app.get("/api/waste/requests", async (req, res) => {
  const requests = await WasteRequest.find();
  res.json(requests);
});

// Approve request (Admin)
app.post("/api/waste/requests/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { collector_info } = req.body;

    const request = await WasteRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "approved";
    request.collector_info = collector_info || "Collector assigned";
    await request.save();

    res.json({ message: "Request approved", request });
  } catch (err) {
    console.error("Approve Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Complete request (Collector/Admin)
app.post("/api/waste/requests/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await WasteRequest.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "completed";
    await request.save();

    const user = await User.findById(request.user_id);
    if (user) {
      const factor =
        { Plastic: 10, Paper: 5, Glass: 8, Organic: 2 }[request.waste_type] ||
        1;
      const points_awarded = Math.round(request.weight * factor);
      user.points += points_awarded;
      await user.save();

      const tx = new Transaction({
        user_id: user._id,
        type: "credit",
        points: points_awarded,
        description: `Waste submission (${request.waste_type})`,
      });
      await tx.save();
    }

    res.json({ message: "Request completed and points awarded", request });
  } catch (err) {
    console.error("Complete Request Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user transactions
app.get("/api/transactions/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userTx = await Transaction.find({ user_id });
    res.json(userTx);
  } catch (err) {
    console.error("Transactions Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redeem reward
app.post("/api/rewards/redeem", async (req, res) => {
  try {
    const { user_id, reward_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const reward = rewards.find((r) => r.id === reward_id);
    if (!reward) return res.status(400).json({ error: "Reward not found" });
    if (user.points < reward.cost)
      return res.status(400).json({ error: "Insufficient points" });

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
});

// Root healthcheck
app.get("/", (req, res) => res.send("EcoPay backend running ✅"));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
);
