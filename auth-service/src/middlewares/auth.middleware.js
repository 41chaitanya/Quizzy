const { verifyToken } = require("../utils/jwt");
const logger = require("../utils/logger");

/**
 * Middleware: Authenticate request via Bearer token in Authorization header
 * Attaches decoded user (id, name, username, role) to req.user
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Use Authorization: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. Token is missing." });
    }

    const decoded = verifyToken(token);

    // Attach user details from token to request
    req.user = {
      id: decoded.id,
      name: decoded.name,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (err) {
    logger.warn(`Authentication failed: ${err.message}`);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    return res.status(401).json({ success: false, message: "Authentication failed." });
  }
};

/**
 * Middleware: Role-based access control
 * Usage: authorize("admin") or authorize("admin", "teacher")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.username} (role: ${req.user.role})`);
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(", ")}.`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
