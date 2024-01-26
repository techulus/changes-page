import type { NextApiRequest, NextApiResponse } from "next";
import { IPost } from "@changes-page/supabase/types/page";
import { allowCors } from "../../lib/cors";
import {
  fetchPosts,
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../lib/data";
import { convertMarkdownToPlainText } from "@changes-page/utils";
import { getPageUrl, getPostUrl } from "../../lib/url";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPost[] | null>
) {
  await allowCors(req, res);

  const hostname = String(req?.headers?.host);
  const { limit } = req?.query;

  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug)
    );

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    const pageUrl = getPageUrl(page, settings);
    const { posts } = await fetchPosts(String(page?.id), {
      limit: Number(limit),
    });

    const postsWithUrl = await Promise.all(
      (posts ?? []).map((post) => ({
        ...post,
        url: getPostUrl(pageUrl, post),
        plain_text_content: convertMarkdownToPlainText(post.content),
      }))
    );

    res.status(200).json(postsWithUrl);
  } catch (e: Error | any) {
    console.log("changes.md [Error]", e);
    res.status(200).json([]);
  }
}

export default handler;
