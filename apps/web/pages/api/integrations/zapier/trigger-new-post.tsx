import { supabaseAdmin } from "@changes-page/supabase/admin";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPageUrl, getPostUrl } from "../../../../utils/hooks/usePageUrl";
import {
  createOrRetrievePageSettings,
  getPageByIntegrationSecret,
} from "../../../../utils/useDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Pick<IPost, "id" | "title" | "content" | "tags" | "created_at">[]
    | null
    | IErrorResponse
  >
) {
  let {
    query: { page_secret_key, page, per_page, status },
  } = req;

  if (!page_secret_key) {
    res
      .status(400)
      .json({ error: { statusCode: 400, message: "Invalid request" } });
  }

  try {
    const pageDetails = await getPageByIntegrationSecret(
      String(page_secret_key)
    );

    console.log("Zapier: get posts for", pageDetails?.id, "input", req.query);

    const offset = Number(page) * Number(per_page);
    const limit = Number(per_page) ?? 50;

    const { data: posts } = await supabaseAdmin
      .from("posts")
      .select("id,title,content,tags,created_at")
      .eq("page_id", String(pageDetails.id))
      .eq("status", status as PostStatus)
      .order("created_at", { ascending: false })
      .range(offset, limit - 1 + offset);

    const pageSettings = await createOrRetrievePageSettings(pageDetails.id);

    const postsWithUrl = (posts ?? []).map((post: IPost) => ({
      ...post,
      url: getPostUrl(getPageUrl(pageDetails, pageSettings), post),
    }));

    res.status(200).json(postsWithUrl);
  } catch (e: Error | any) {
    if (e.message.includes("Invalid")) {
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: e.message } });
    }
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}
