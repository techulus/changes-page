import { IPost } from "@changespage/supabase/types/page";
import { convertMarkdownToPlainText } from "@changespage/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { allowCors } from "../../lib/cors";
import {
  fetchPosts,
  fetchPostsWithPagination,
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../lib/data";
import { getPageUrl, getPostUrl } from "../../lib/url";

type PostWithUrl = IPost & { url: string; plain_text_content: string };

type V1Response = PostWithUrl[] | null;

type V2Response =
  | { posts: PostWithUrl[]; totalCount: number }
  | { error: string }
  | null;

async function handleV1(req: NextApiRequest, res: NextApiResponse<V1Response>) {
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
      limit: limit ? Number(limit) : undefined,
    });

    const postsWithUrl = (posts ?? []).map((post) => ({
      ...post,
      url: getPostUrl(pageUrl, post),
      plain_text_content: convertMarkdownToPlainText(post.content),
    }));

    res.status(200).json(postsWithUrl);
  } catch (e: unknown) {
    console.log("Failed to fetch posts [V1 Error]", e);
    res.status(200).json([]);
  }
}

async function handleV2(req: NextApiRequest, res: NextApiResponse<V2Response>) {
  const hostname = String(req?.headers?.host);
  const { limit, offset } = req?.query;

  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug)
    );

    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    if (!settings) {
      res.status(404).json({ error: "Page settings not found" });
      return;
    }

    const pageUrl = getPageUrl(page, settings);
    const { posts, postsCount } = await fetchPostsWithPagination(
      String(page?.id),
      {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      }
    );

    const postsWithUrl = (posts ?? []).map((post) => ({
      ...post,
      url: getPostUrl(pageUrl, post),
      plain_text_content: convertMarkdownToPlainText(post.content),
    }));

    res.status(200).json({ posts: postsWithUrl, totalCount: postsCount });
  } catch (e: unknown) {
    console.log("Failed to fetch posts [V2 Error]", e);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<V1Response | V2Response>
) {
  await allowCors(req, res);

  const apiVersion = req.headers["x-api-version"];

  if (apiVersion === "2") {
    return handleV2(req, res);
  }

  return handleV1(req, res);
}

export default handler;
