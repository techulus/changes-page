import { supabaseAdmin } from "@changes-page/supabase/admin";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPost } from "@changes-page/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { PAGINATION_LIMIT } from "../../lib/data";

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
      .select("id,title,content,tags,publication_date,updated_at,created_at")
      .eq("page_id", String(page_id))
      .eq("status", "published")
      .range(Number(offset), Number(PAGINATION_LIMIT - 1 + Number(offset)))
      .order("publication_date", { ascending: false });

    res.status(200).json(posts as Array<IPost>);
  } catch (e: unknown) {
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}

export default handler;
