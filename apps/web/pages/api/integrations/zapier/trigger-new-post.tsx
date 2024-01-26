import type { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPost } from "@changes-page/supabase/types/page";
import { supabaseAdmin } from "../../../../utils/supabase/supabase-admin";
import { getPageByIntegrationSecret } from "../../../../utils/useDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Pick<IPost, "id" | "title" | "content" | "type" | "created_at">[]
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

    console.log("get posts for", pageDetails?.id, "input", req.query);

    const start = page ? Number(page) * Number(per_page) : 0;
    const end = page ? start + Number(per_page) : Number(per_page);

    const { data: posts } = await supabaseAdmin
      .from("posts")
      .select("id,title,content,type,created_at")
      .eq("page_id", String(pageDetails.id))
      .eq("status", String(status))
      .range(start, end)
      .order("created_at", { ascending: false });

    res.status(200).json(posts);
  } catch (e: Error | any) {
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}
