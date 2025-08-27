// backend/src/middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "R1yA$up3rS3cr3tK3y!2025";

// ===== ADMIN AUTH MIDDLEWARE =====
function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided or token is invalid",
    });
  }

  const [bearer, token] = authHeader.split(" ").map((str) => str.trim());
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided or token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    req.admin = decoded; // attach admin info (id, role) to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided or token is invalid",
    });
  }
}

module.exports = { adminMiddleware };
