import { getRedis } from "../config/redis.js";
import logger from "../utils/logger.js";

/**
 * Redis-backed rate limiter middleware factory
 */
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = "rl:global",
  message = "Too many requests. Please try again later.",
} = {}) => {
  const windowSec = Math.ceil(windowMs / 1000);

  return async (req, res, next) => {
    try {
      const redis = getRedis();
      const ip = req.ip || req.connection.remoteAddress || "unknown";
      const key = `${keyPrefix}:${ip}`;

      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      const ttl = await redis.ttl(key);

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - current));
      res.setHeader("X-RateLimit-Reset", Date.now() + ttl * 1000);

      if (current > max) {
        logger.warn(`Rate limit exceeded for IP: ${ip} on key: ${keyPrefix}`);
        return res.status(429).json({
          success: false,
          message,
          retryAfter: ttl,
        });
      }

      next();
    } catch (err) {
      logger.error(`Rate limiter error: ${err.message}`);
      next();
    }
  };
};

/** Global API limiter: 100 req / 15 min */
export const globalLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  keyPrefix: "rl:global",
  message: "Too many requests from this IP. Please try again later.",
});

/** Auth limiter (login/register): 10 req / 15 min */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: "rl:auth",
  message: "Too many authentication attempts. Please wait 15 minutes before trying again.",
});

/** OTP limiter: 5 req / 10 min */
export const otpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyPrefix: "rl:otp",
  message: "Too many OTP requests. Please wait 10 minutes before trying again.",
});

export { createRateLimiter };
