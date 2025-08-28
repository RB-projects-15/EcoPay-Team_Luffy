// backend/src/middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "R1yA$up3rS3cr3tK3y!2025";

// ===== ADMIN AUTH MIDDLEWARE =====
function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  // Extract token after 'Bearer '
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1].trim()
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Malformed or missing token",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Attach admin info to request
    req.admin = decoded;
    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message: msg });
  }
}

module.exports = { adminMiddleware };
