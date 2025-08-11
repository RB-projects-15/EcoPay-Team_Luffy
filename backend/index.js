/**
 * EcoPay - Simple in-memory backend for Assignment 4
 * Run:
 *   npm install
 *   npm start
 *
 * API docs: http://localhost:3000/api-docs
 */
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// In-memory stores
const users = [];
const wastes = [];
const transactions = [];
const rewards = [
  { id: "r1", name: "Reusable Bag", cost: 100 },
  { id: "r2", name: "Coffee Mug", cost: 250 },
];

// Helper
function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
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

// 1. Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  if (findUserByEmail(email))
    return res.status(400).json({ error: "Email already exists" });
  const hashed = await bcrypt.hash(password, 8);
  const user = { id: uuidv4(), name, email, password: hashed, points: 0 };
  users.push(user);
  res.json({ message: "User registered successfully", user_id: user.id });
});

// 2. Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user_id: user.id });
});

// 3. Scan Waste QR
app.post("/api/waste/scan", (req, res) => {
  const { qr_code_data } = req.body;
  if (!qr_code_data) return res.status(400).json({ error: "Invalid QR code" });
  const map = {
    plastic: "Plastic",
    paper: "Paper",
    glass: "Glass",
    organic: "Organic",
  };
  const key = qr_code_data.toLowerCase();
  if (!map[key]) return res.status(400).json({ error: "Invalid QR code" });
  const points = { Plastic: 10, Paper: 5, Glass: 8, Organic: 2 }[map[key]] || 1;
  res.json({ waste_type: map[key], points });
});

// 4. Upload Waste Image (simulated)
app.post("/api/waste/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Invalid image format" });
  const waste_type = "Plastic";
  const points = 10;
  res.json({ waste_type, points });
});

// 5. Submit Waste
app.post("/api/waste/submit", (req, res) => {
  const { user_id, waste_type, weight, image_url } = req.body;
  if (!user_id || !waste_type || typeof weight !== "number") {
    return res.status(400).json({ error: "Invalid waste data" });
  }
  const user = users.find((u) => u.id === user_id);
  if (!user) return res.status(400).json({ error: "User not found" });
  const factor =
    { Plastic: 10, Paper: 5, Glass: 8, Organic: 2 }[waste_type] || 1;
  const points_awarded = Math.round(weight * factor);
  const submission = {
    id: uuidv4(),
    user_id,
    waste_type,
    weight,
    image_url: image_url || null,
    points_awarded,
    submitted_at: new Date().toISOString(),
  };
  wastes.push(submission);
  user.points += points_awarded;
  const tx = {
    id: uuidv4(),
    user_id,
    type: "credit",
    points: points_awarded,
    date: new Date().toISOString(),
    description: `Waste submission (${waste_type})`,
  };
  transactions.push(tx);
  res.json({ message: "Waste submitted successfully", points_awarded });
});

// 6. Get User Transactions
app.get("/api/transactions/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const user = users.find((u) => u.id === user_id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const userTx = transactions.filter((t) => t.user_id === user_id);
  res.json(userTx);
});

// 7. Redeem Rewards
app.post("/api/rewards/redeem", (req, res) => {
  const { user_id, reward_id } = req.body;
  const user = users.find((u) => u.id === user_id);
  if (!user) return res.status(400).json({ error: "User not found" });
  const reward = rewards.find((r) => r.id === reward_id);
  if (!reward) return res.status(400).json({ error: "Reward not found" });
  if (user.points < reward.cost)
    return res.status(400).json({ error: "Insufficient points" });
  user.points -= reward.cost;
  const tx = {
    id: uuidv4(),
    user_id,
    type: "debit",
    points: reward.cost,
    date: new Date().toISOString(),
    description: `Redeemed ${reward.name}`,
  };
  transactions.push(tx);
  res.json({ message: "Reward redeemed successfully" });
});

app.get("/", (req, res) => res.send("EcoPay backend running"));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
