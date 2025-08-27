// backend/src/server.js
require("dotenv").config(); // ✅ Load .env variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

// ====== App Setup ======
const app = express();

// ✅ Allow frontend (5173) + admin-frontend (5174)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// ✅ Serve uploaded files
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// ====== MongoDB Connection ======
const mongoURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecopay";
mongoose
  .connect(mongoURL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Routes ======
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// ====== Swagger Docs ======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ====== Health Check ======
app.get("/", (req, res) => res.send("EcoPay backend running ✅"));

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
