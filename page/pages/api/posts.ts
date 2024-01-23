import type { NextApiRequest, NextApiResponse } from "next";
import { PAGINATION_LIMIT } from "../../lib/data";
import { supabaseAdmin } from "../../utils/supabase/supabase-admin";
import { IErrorResponse } from "./../../data/api.interface";
import { IPost } from "./../../data/page.interface";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPost[] | null | IErrorResponse>
) {
  let {
    query: { page_id, offset },
  } = req;

  if (!page_id || !offset) {
    res
      .status(400)
      .json({ error: { statusCode: 400, message: "Invalid request" } });
  }

  try {
    const { data: posts } = await supabaseAdmin
      .from("posts")
      .select("id,title,content,type,publication_date,updated_at,created_at")
      .eq("page_id", String(page_id))
      .eq("status", "published")
      .range(Number(offset), Number(PAGINATION_LIMIT - 1 + Number(offset)))
      .order("created_at", { ascending: false });

    res.status(200).json(posts as Array<IPost>);
  } catch (e: Error | any) {
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}

export default handler;
