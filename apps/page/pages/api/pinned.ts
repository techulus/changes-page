import type { NextApiRequest, NextApiResponse } from "next";
import { IPost } from "../../data/page.interface";
import { allowCors } from "../../lib/cors";
import { fetchRenderData, translateHostToPageIdentifier } from "../../lib/data";
import { getPageUrl, getPostUrl } from "../../lib/url";
import { supabaseAdmin } from "../../utils/supabase/supabase-admin";

type IPostWithUrl = Pick<
  IPost,
  "id" | "title" | "content" | "type" | "created_at"
> & { url: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPostWithUrl | null>
) {
  await allowCors(req, res);

  const hostname = String(req?.headers?.host);
  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug)
    );

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    const pageUrl = getPageUrl(page, settings);

    // fetch pinned post for page
    const { data, error: postsError } = await supabaseAdmin
      .from("posts")
      .select("id,title,content,type,publication_date,updated_at,created_at")
      .eq("page_id", String(page?.id))
      .eq("status", "published")
      .eq("id", String(settings?.pinned_post_id))
      .order("created_at", { ascending: false })
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

    const postsWithUrl = posts.map((post) => {
      return {
        ...post,
        url: getPostUrl(pageUrl, post),
      };
    });

    res.status(200).json(postsWithUrl[0]);
  } catch (e: Error | any) {
    console.log("changes.md [Error]", e);
    res.status(404).json(null);
  }
}

export default handler;
