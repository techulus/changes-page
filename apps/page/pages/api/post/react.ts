import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { getVisitorId } from "../../../lib/visitor-auth";

export default async function reactToPost(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean }>
) {
  const { post_id, reaction } = req.body;

  const visitor_id = await getVisitorId(req);

  if (!req.cookies.cp_visitor_token && !req.cookies.cp_pa_vid) {
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    const { data } = await supabaseAdmin
      .from("post_reactions")
      .select("*")
      .eq("post_id", post_id)
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    const { error } = await supabaseAdmin.from("post_reactions").upsert([
      {
        id: data?.id ?? v4(),
        post_id: String(post_id),
        visitor_id: visitor_id ?? v4(),
        // @ts-ignore
        [reaction]: data ? !data[reaction] : true,
      },
    ]);

    if (error) {
      console.error("reactToPost [Error]", error);
    }

    res.status(200).json({ success: true });
  } catch (e: unknown) {
    console.log("reactToPost [Error]", e);
    res.status(200).json({ success: false });
  }
}
