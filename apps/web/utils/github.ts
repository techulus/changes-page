import * as crypto from "crypto";
import { App } from "@octokit/app";

let app: App | null = null;

function getApp(): App {
  if (!app) {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!appId || !privateKey) {
      throw new Error("GitHub App credentials not configured");
    }

    app = new App({
      appId,
      privateKey: Buffer.from(privateKey, "base64").toString("utf-8"),
    });
  }
  return app;
}

export async function getOctokit(installationId: number) {
  return getApp().getInstallationOctokit(installationId);
}

export function verifyGitHubWebhookSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature || !signature.startsWith("sha256=")) return false;

  try {
    const expectedSignature =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function getPRDetails(
  owner: string,
  repo: string,
  prNumber: number,
  installationId: number
) {
  const octokit = await getOctokit(installationId);
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner,
      repo,
      pull_number: prNumber,
    }
  );
  return data;
}

export async function getPRCommits(
  owner: string,
  repo: string,
  prNumber: number,
  installationId: number
) {
  const octokit = await getOctokit(installationId);
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    {
      owner,
      repo,
      pull_number: prNumber,
    }
  );
  return data;
}

export async function getPRFiles(
  owner: string,
  repo: string,
  prNumber: number,
  installationId: number
) {
  const octokit = await getOctokit(installationId);
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: prNumber,
    }
  );
  return data;
}

export async function createPRComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
  installationId: number
): Promise<number> {
  const octokit = await getOctokit(installationId);
  const { data } = await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner,
      repo,
      issue_number: issueNumber,
      body,
    }
  );
  return data.id;
}

export async function addReactionToComment(
  owner: string,
  repo: string,
  commentId: number,
  reaction:
    | "eyes"
    | "+1"
    | "-1"
    | "laugh"
    | "confused"
    | "heart"
    | "hooray"
    | "rocket",
  installationId: number
): Promise<void> {
  const octokit = await getOctokit(installationId);
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
    {
      owner,
      repo,
      comment_id: commentId,
      content: reaction,
    }
  );
}
