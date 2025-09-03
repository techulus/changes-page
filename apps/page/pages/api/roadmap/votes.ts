import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { supabaseAdmin } from "@changes-page/supabase/admin";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function getRoadmapItemVotes(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; vote_count: number; user_voted: boolean }>
) {
  // Validate HTTP method
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, vote_count: 0, user_voted: false });
  }

  // Validate item_id
  const { item_id } = req.query;
  
  if (!item_id) {
    return res.status(400).json({ ok: false, vote_count: 0, user_voted: false });
  }

  if (Array.isArray(item_id)) {
    return res.status(400).json({ ok: false, vote_count: 0, user_voted: false });
  }

  if (!UUID_REGEX.test(item_id)) {
    return res.status(400).json({ ok: false, vote_count: 0, user_voted: false });
  }

  let { cp_pa_vid: visitor_id } = req.cookies;

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    // Get vote count
    const { data: voteCount, error: countError } = await supabaseAdmin
      .from("roadmap_votes")
      .select("id", { count: 'exact' })
      .eq("item_id", item_id);

    if (countError) {
      console.error("getRoadmapItemVotes [Count Error]", countError);
    }

    // Check if current user voted
    const { data: userVote, error: userError } = await supabaseAdmin
      .from("roadmap_votes")
      .select("id")
      .eq("item_id", item_id)
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (userError) {
      console.error("getRoadmapItemVotes [User Error]", userError);
    }

    res.status(200).json({
      ok: true,
      vote_count: voteCount?.length || 0,
      user_voted: !!userVote,
    });
  } catch (e: Error | any) {
    console.log("getRoadmapItemVotes [Error]", e);
    res.status(200).json({ ok: true, vote_count: 0, user_voted: false });
  }
}