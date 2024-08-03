import arcjet, { slidingWindow } from "@arcjet/next";
import { NextApiRequest, NextApiResponse } from "next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // track requests by IP address
  rules: [
    slidingWindow({
      mode: "LIVE",
      interval: 60,
      max: 20,
    }),
  ],
});

export async function apiRateLimiter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: {
        statusCode: 429,
        message: "You are doing that too often. Please try again later.",
      },
    });
  }
}
