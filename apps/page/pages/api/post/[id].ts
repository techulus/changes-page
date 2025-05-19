import { supabaseAdmin } from "@changes-page/supabase/admin";
import { IPost } from "@changes-page/supabase/types/page";
import { convertMarkdownToPlainText } from "@changes-page/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { allowCors } from "../../../lib/cors";
import {
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../../lib/data";
import { getPageUrl, getPostUrl } from "../../../lib/url";

type IPostWithUrl = Pick<
  IPost,
  "id" | "title" | "content" | "tags" | "created_at"
> & { url: string; plain_text_content: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPostWithUrl | null>
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json(null);
    return;
  }

  await allowCors(req, res);

  const hostname = String(req?.headers?.host);
  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug)
    );

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    const pageUrl = getPageUrl(page, settings, hostname);

    const { data, error: postsError } = await supabaseAdmin
      .from("posts")
      .select("id,title,content,tags,publication_date,updated_at,created_at")
      .eq("id", String(id))
      .eq("page_id", String(page?.id))
      .eq("status", "published")
      .order("publication_date", { ascending: false })
      .limit(1);

    if (postsError) {
      console.error("Fetch post error", postsError);
      throw new Error("Failed to fetch posts");
    }

    const posts = data as Array<IPost>;

    if (!posts?.length) {
      res.status(404).json(null);
      return;
    }

    const post = posts[0];

    res.status(200).json({
      ...post,
      url: getPostUrl(pageUrl, post),
      plain_text_content: convertMarkdownToPlainText(post.content),
    });
  } catch (e: Error | any) {
    console.log("Failed to fetch post [Error]", e);
    res.status(404).json(null);
  }
}

export default handler;
