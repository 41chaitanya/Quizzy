const logger = require("../utils/logger");

/**
 * Global error handler middleware
 * Must be the LAST middleware registered in app.js
 */
const errorHandler = (err, req, res, next) => {
  // If it's a known thrown object (from service layer)
  if (err.status && err.message) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      message: `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Value"} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors (should normally be caught in middleware, but just in case)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
  }

  // Unexpected errors
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, url: req.originalUrl });

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again later."
      : err.message,
  });
};

/**
 * 404 handler for unmatched routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

module.exports = { errorHandler, notFound };
