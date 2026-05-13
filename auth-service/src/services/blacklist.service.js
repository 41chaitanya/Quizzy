import { getRedis } from "../config/redis.js";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const BLACKLIST_PREFIX = "bl:token:";

/**
 * Blacklist a JWT token until its expiry time
 */
export const blacklistToken = async (token) => {
  const redis = getRedis();

  try {
    const decoded = verifyToken(token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl <= 0) return;

    const key = `${BLACKLIST_PREFIX}${decoded.id}:${decoded.iat}`;
    await redis.setex(key, ttl, "1");

    logger.info(`Token blacklisted for user: ${decoded.username} (expires in ${ttl}s)`);
  } catch (err) {
    logger.warn(`Failed to blacklist token: ${err.message}`);
  }
};

/**
 * Check if a token is blacklisted
 */
export const isTokenBlacklisted = async (decoded) => {
  const redis = getRedis();
  const key = `${BLACKLIST_PREFIX}${decoded.id}:${decoded.iat}`;
  const result = await redis.get(key);
  return result !== null;
};
