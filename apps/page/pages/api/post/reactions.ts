import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { supabaseAdmin } from "@changes-page/supabase/admin";

export default async function getPostReactions(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; aggregate: any; user: any }>
) {
  let { post_id } = req.query;
  let { cp_pa_vid: visitor_id } = req.cookies;

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    const { data: aggregate, error: aggregateError } = await supabaseAdmin.rpc(
      "post_reactions_aggregate",
      {
        postid: String(post_id),
      }
    );

    if (aggregateError) {
      console.error("getPostReactions [Error]", aggregateError);
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from("post_reactions")
      .select("*")
      .eq("post_id", String(post_id))
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (userError) {
      console.error("getPostReactions [Error]", userError);
    }

    res.status(200).json({
      ok: true,
      aggregate: aggregate?.length
        ? {
            thumbs_up: aggregate[0].thumbs_up_count,
            thumbs_down: aggregate[0].thumbs_down_count,
            heart: aggregate[0].heart_count,
            sad: aggregate[0].sad_count,
            rocket: aggregate[0].rocket_count,
          }
        : null,
      user,
    });
  } catch (e: Error | any) {
    console.log("getPostReactions [Error]", e);
    res.status(200).json({ ok: true, aggregate: null, user: null });
  }
}
