import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { supabaseAdmin } from "@changes-page/supabase/admin";

export default async function voteOnRoadmapItem(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; vote_count?: number; error?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { item_id } = req.body;
  
  if (!item_id) {
    return res.status(400).json({ ok: false, error: 'Missing item_id' });
  }

  let { cp_pa_vid: visitor_id } = req.cookies;

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    // Check if user has already voted
    const { data: existingVote } = await supabaseAdmin
      .from("roadmap_votes")
      .select("*")
      .eq("item_id", item_id)
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (existingVote) {
      // Remove vote (toggle off)
      const { error: deleteError } = await supabaseAdmin
        .from("roadmap_votes")
        .delete()
        .eq("id", existingVote.id);

      if (deleteError) {
        console.error("voteOnRoadmapItem [Delete Error]", deleteError);
        return res.status(500).json({ ok: false, error: 'Failed to remove vote' });
      }
    } else {
      // Add vote
      const { error: insertError } = await supabaseAdmin
        .from("roadmap_votes")
        .insert({
          id: v4(),
          item_id: String(item_id),
          visitor_id: visitor_id,
        });

      if (insertError) {
        console.error("voteOnRoadmapItem [Insert Error]", insertError);
        return res.status(500).json({ ok: false, error: 'Failed to add vote' });
      }
    }

    // Get updated vote count
    const { data: voteCount, error: countError } = await supabaseAdmin
      .from("roadmap_votes")
      .select("id", { count: 'exact' })
      .eq("item_id", item_id);

    if (countError) {
      console.error("voteOnRoadmapItem [Count Error]", countError);
    }

    res.status(200).json({ 
      ok: true, 
      vote_count: voteCount?.length || 0
    });
  } catch (e: Error | any) {
    console.log("voteOnRoadmapItem [Error]", e);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}