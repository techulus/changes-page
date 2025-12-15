import type { NextApiRequest, NextApiResponse } from "next";
import {
  addReactionToComment,
  verifyGitHubWebhookSignature,
} from "../../../../utils/github";
import inngestClient from "../../../../utils/inngest";

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

const BOT_MENTIONS = ["@changepage", "@changes-page"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("GITHUB_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  if (!verifyGitHubWebhookSignature(rawBody, signature, webhookSecret)) {
    console.error("Invalid webhook signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.headers["x-github-event"] as string;
  const payload = JSON.parse(rawBody);

  console.log("GitHub webhook received:", { event, action: payload.action });

  if (event === "issue_comment" && payload.action === "created") {
    return handleIssueComment(payload, res);
  }

  if (event === "installation" && payload.action === "created") {
    console.log("New installation:", payload.installation.id);
  }

  return res.status(200).json({ message: "Event received" });
}

async function handleIssueComment(payload: any, res: NextApiResponse) {
  const comment = payload.comment?.body || "";
  const isPR = !!payload.issue?.pull_request;

  if (!isPR) {
    return res.status(200).json({ message: "Not a PR comment, skipping" });
  }

  const commentLower = comment.toLowerCase();
  const foundMention = BOT_MENTIONS.find((mention) =>
    commentLower.includes(mention.toLowerCase())
  );

  if (!foundMention) {
    return res.status(200).json({ message: "No mention found, skipping" });
  }

  const installationId = payload.installation?.id;
  if (!installationId) {
    console.error("No installation ID in webhook");
    return res.status(400).json({ error: "No installation ID" });
  }

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const prNumber = payload.issue.number;
  const issueNumber = payload.issue.number;
  const commentId = payload.comment.id;
  const commentAuthor = payload.comment.user.login;

  const mentionIndex = commentLower.indexOf(foundMention.toLowerCase());
  const userInstructions = comment
    .substring(mentionIndex + foundMention.length)
    .trim();

  console.log("Processing changelog request:", {
    owner,
    repo,
    prNumber,
    commentAuthor,
    userInstructions: userInstructions.substring(0, 100),
  });

  try {
    await addReactionToComment(owner, repo, commentId, "eyes", installationId);
  } catch (error) {
    console.error("Failed to add reaction:", error);
  }

  try {
    await inngestClient.send({
      name: "github/changelog.process",
      data: {
        installationId,
        owner,
        repo,
        prNumber,
        issueNumber,
        userInstructions,
        commentAuthor,
      },
    });

    return res.status(200).json({
      message: "Changelog generation triggered",
      pr: prNumber,
    });
  } catch (error) {
    console.error("Failed to trigger changelog job:", error);
    return res.status(500).json({ error: "Failed to trigger job" });
  }
}
