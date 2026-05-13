import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    connectRedis();

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Auth service running on http://localhost:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Health check: http://localhost:${PORT}/api/auth/health`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
