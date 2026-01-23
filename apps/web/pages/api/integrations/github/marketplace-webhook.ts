import type { NextApiRequest, NextApiResponse } from "next";
import { verifyGitHubWebhookSignature } from "../../../../utils/github";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const webhookSecret =
    process.env.GITHUB_MARKETPLACE_WEBHOOK_SECRET ||
    process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("GitHub Marketplace webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  if (!verifyGitHubWebhookSignature(rawBody, signature, webhookSecret)) {
    console.error("Invalid marketplace webhook signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.headers["x-github-event"] as string;
  const payload = JSON.parse(rawBody);

  console.log("GitHub Marketplace webhook received:", {
    event,
    action: payload.action,
    account: payload.marketplace_purchase?.account?.login,
    plan: payload.marketplace_purchase?.plan?.name,
  });

  return res.status(200).json({ message: "Event received" });
}
