import type { NextApiRequest, NextApiResponse } from "next";
import { getOctokit } from "../../../../utils/github";
import { withAuth } from "../../../../utils/withAuth";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
}

interface ReposResponse {
  repositories: GitHubRepo[];
}

const handler = withAuth<ReposResponse>(async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const { installation_id } = req.query;

  if (!installation_id) {
    return res.status(400).json({
      error: { statusCode: 400, message: "installation_id is required" },
    });
  }

  try {
    const octokit = await getOctokit(Number(installation_id));
    const { data } = await octokit.request("GET /installation/repositories", {
      per_page: 100,
    });

    return res.status(200).json({
      repositories: data.repositories.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: { login: repo.owner.login },
        private: repo.private,
      })),
    });
  } catch (error) {
    console.error("Error fetching repos:", error);
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: error instanceof Error ? error.message : "Failed to fetch repos",
      },
    });
  }
});

export default handler;
