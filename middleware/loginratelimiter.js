import redisClient from "../config/redis.config.js";

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60; // 15 minutes

export const loginRateLimiter = async (req, res, next) => {
  const key = `login:${req.ip}`;

  const attempts = await redisClient.get(key);

  if (attempts && Number(attempts) >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many login attempts. Try again after 15 minutes.",
    });
  }

  next();
};
