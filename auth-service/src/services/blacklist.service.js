const { getRedis } = require("../config/redis");
const { verifyToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const BLACKLIST_PREFIX = "bl:token:";

/**
 * Blacklist a JWT token until its expiry time
 * Stores the token's JTI (or hash) in Redis/memory with TTL = remaining token lifetime
 *
 * @param {string} token - JWT token to blacklist
 */
const blacklistToken = async (token) => {
  const redis = getRedis();

  try {
    const decoded = verifyToken(token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now; // remaining seconds until token expires

    if (ttl <= 0) {
      // Token already expired, no need to blacklist
      return;
    }

    // Use token's iat + id as unique key (avoids storing full token)
    const key = `${BLACKLIST_PREFIX}${decoded.id}:${decoded.iat}`;
    await redis.setex(key, ttl, "1");

    logger.info(`Token blacklisted for user: ${decoded.username} (expires in ${ttl}s)`);
  } catch (err) {
    // If token is already invalid/expired, ignore
    logger.warn(`Failed to blacklist token: ${err.message}`);
  }
};

/**
 * Check if a token is blacklisted
 *
 * @param {object} decoded - Decoded JWT payload (must have id and iat)
 * @returns {boolean} true if blacklisted
 */
const isTokenBlacklisted = async (decoded) => {
  const redis = getRedis();
  const key = `${BLACKLIST_PREFIX}${decoded.id}:${decoded.iat}`;
  const result = await redis.get(key);
  return result !== null;
};

module.exports = { blacklistToken, isTokenBlacklisted };
