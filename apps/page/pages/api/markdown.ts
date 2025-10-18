import { DateTime } from "@changes-page/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchPosts,
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../lib/data";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | null>
) {
  const hostname = String(req?.headers?.host);
  const { limit } = req?.query;

  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  res.setHeader("Content-Type", "text/markdown");

  try {
    const { page } = await fetchRenderData(String(domain || url_slug));

    if (!page) throw new Error("Page not found");

    const { posts } = await fetchPosts(String(page?.id), {
      limit: Number(limit),
    });

    let markdown = "";

    posts?.forEach((post) => {
      markdown += `## ${post.title}
${DateTime.fromISO(post.publication_date ?? post.created_at).toRelative()}

${post.content}


`;
    });

    res.status(200).send(markdown);
  } catch (e: unknown) {
    console.log("Failed to fetch posts [changes.md] [Error]", e);
    res.status(200).send("## No posts Found");
  }
}

export default handler;
