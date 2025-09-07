import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClientForAPI } from "../../../utils/supabase/supabase-admin";

export default async function getPostReactions(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; aggregate: any }>
) {
  let { post_id } = req.query;

  try {
    const { user } = await getSupabaseServerClientForAPI({ req, res });
    if (!user) {
      return res.status(401).json({
        ok: false,
        aggregate: null,
      });
    }

    const { data: aggregate, error: aggregateError } = await supabaseAdmin.rpc(
      "post_reactions_aggregate",
      {
        postid: String(post_id),
      }
    );

    if (aggregateError) {
      console.error("getPostReactions [Error]", aggregateError);
    }

    if (!aggregate?.length) {
      res.status(200).json({
        ok: true,
        aggregate: {
          thumbs_up: 0,
          thumbs_down: 0,
          heart: 0,
          sad: 0,
          rocket: 0,
        },
      });
    }

    res.status(200).json({
      ok: true,
      aggregate: {
        thumbs_up: aggregate[0].thumbs_up_count,
        thumbs_down: aggregate[0].thumbs_down_count,
        heart: aggregate[0].heart_count,
        sad: aggregate[0].sad_count,
        rocket: aggregate[0].rocket_count,
      },
    });
  } catch (e: Error | any) {
    console.log("getPostReactions [Error]", e);
    res.status(500).json({ ok: false, aggregate: null });
  }
}
