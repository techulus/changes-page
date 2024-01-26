import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { supabaseAdmin } from "@changes-page/supabase/admin";

export default async function reactToPost(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean }>
) {
  const { post_id, reaction } = req.body;
  let { cp_pa_vid: visitor_id } = req.cookies;

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
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

    res.status(200).json({ ok: true });
  } catch (e: Error | any) {
    console.log("reactToPost [Error]", e);
    res.status(200).json({ ok: true });
  }
}
