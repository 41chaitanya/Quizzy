const logger = require("../utils/logger");

/**
 * In-memory store that mimics Redis API for dev environments
 * Used when Redis is not configured or connection fails
 */
class MemoryStore {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.timers.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value) {
    this.store.set(key, { value, expiresAt: null });
    return "OK";
  }

  async setex(key, seconds, value) {
    const expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, { value, expiresAt });
    if (this.timers.has(key)) clearTimeout(this.timers.get(key));
    this.timers.set(key, setTimeout(() => { this.store.delete(key); this.timers.delete(key); }, seconds * 1000));
    return "OK";
  }

  async incr(key) {
    const item = this.store.get(key);
    if (!item || (item.expiresAt && Date.now() > item.expiresAt)) {
      this.store.set(key, { value: "1", expiresAt: null });
      return 1;
    }
    const newVal = parseInt(item.value || "0") + 1;
    item.value = newVal.toString();
    return newVal;
  }

  async expire(key, seconds) {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    if (this.timers.has(key)) clearTimeout(this.timers.get(key));
    this.timers.set(key, setTimeout(() => { this.store.delete(key); this.timers.delete(key); }, seconds * 1000));
    return 1;
  }

  async ttl(key) {
    const item = this.store.get(key);
    if (!item) return -2;
    if (!item.expiresAt) return -1;
    const remaining = Math.ceil((item.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async del(key) {
    if (this.timers.has(key)) clearTimeout(this.timers.get(key));
    this.timers.delete(key);
    return this.store.delete(key) ? 1 : 0;
  }
}

let redis = null;

/**
 * Connect to Redis using REDIS_HOST/PORT/PASSWORD or REDIS_URL
 * Falls back to in-memory store if not available
 */
const connectRedis = () => {
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const password = process.env.REDIS_PASSWORD;
  const url = process.env.REDIS_URL;

  const hasRedisConfig = (host && host.trim()) || (url && url.trim());

  if (hasRedisConfig) {
    try {
      const Redis = require("ioredis");

      if (url && url.trim()) {
        redis = new Redis(url, { maxRetriesPerRequest: 3 });
      } else {
        redis = new Redis({
          host: host.trim(),
          port: parseInt(port || "6379"),
          password: password || undefined,
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            if (times > 5) {
              logger.warn("Redis max retries reached — falling back to in-memory store");
              return null; // stop retrying
            }
            return Math.min(times * 200, 2000);
          },
        });
      }

      redis.on("connect", () => {
        logger.info("Redis connected successfully");
      });

      redis.on("error", (err) => {
        logger.error(`Redis error: ${err.message}`);
      });

      // If connection fails after timeout, fallback
      setTimeout(() => {
        if (redis && redis.status !== "ready" && redis.status !== "connect") {
          logger.warn(`Redis status: ${redis.status} — switching to in-memory store`);
          try { redis.disconnect(); } catch (_) {}
          redis = new MemoryStore();
        }
      }, 5000);

      return redis;
    } catch (err) {
      logger.warn(`Redis init failed: ${err.message}. Using in-memory store.`);
      redis = new MemoryStore();
      return redis;
    }
  } else {
    logger.info("No Redis configured — using in-memory store (dev mode)");
    redis = new MemoryStore();
    return redis;
  }
};

const getRedis = () => {
  if (!redis) {
    throw new Error("Store not initialized. Call connectRedis() first.");
  }
  return redis;
};

module.exports = { connectRedis, getRedis };
