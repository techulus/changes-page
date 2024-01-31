import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "./redis";

const updateRateLimit = async (
  ip: string = "local",
  limit: number = 5,
  duration: number = 60
): Promise<{ limit: number; remaining: number; success: boolean }> => {
  const key = `rate_limit:${ip}`;

  let currentCount = await redis.get(key);

  let count = parseInt(currentCount as string, 10) || 0;

  if (count >= limit) {
    return { limit, remaining: limit - count, success: false };
  }

  await redis.incr(key);
  await redis.expire(key, duration);

  return { limit, remaining: limit - (count + 1), success: true };
};

export async function rateLimiter(req: Request) {
  const identifier = req.headers.get("x-forwarded-for") ?? "local";
  const result = await updateRateLimit(identifier);

  return result.success;
}

export async function apiRateLimiter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const identifier = (req.headers["x-forwarded-for"] as string) ?? "local";
  const result = await updateRateLimit(identifier);

  res.setHeader("X-RateLimit-Limit", result.limit);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.success) {
    return res.status(429).json({
      error: {
        statusCode: 429,
        message: "You are doing that too often. Please try again later.",
      },
    });
  }
}
