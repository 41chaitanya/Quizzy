import express from "express";
import cors from "cors";
import morgan from "morgan";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";

const app = express();

// ─── Core Middlewares ─────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization", "X-Auth-Token"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// HTTP request logging via Morgan → Winston
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

/** Auth Service base path: /api/auth */
app.use("/api/auth", authRoutes);

/** Root check */
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "auth-service",
    version: "1.0.0",
    docs: "/api/auth/health",
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
