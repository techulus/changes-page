import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { getVisitorId } from "../../../lib/visitor-auth";

export default async function voteOnRoadmapItem(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; vote_count?: number; error?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { item_id } = req.body;

  if (!item_id) {
    return res.status(400).json({ ok: false, error: "Missing item_id" });
  }

  const visitor_id = await getVisitorId(req);

  try {
    const { data: itemCheck, error: itemCheckError } = await supabaseAdmin
      .from("roadmap_items")
      .select("id, board_id, roadmap_boards!inner(is_public)")
      .eq("id", item_id)
      .eq("roadmap_boards.is_public", true)
      .maybeSingle();

    if (itemCheckError || !itemCheck) {
      return res
        .status(404)
        .json({ ok: false, error: "Item not found or not public" });
    }

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
        return res
          .status(500)
          .json({ ok: false, error: "Failed to remove vote" });
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
        return res.status(500).json({ ok: false, error: "Failed to add vote" });
      }
    }

    // Get updated vote count
    const { count, error: countError } = await supabaseAdmin
      .from("roadmap_votes")
      .select("id", { count: "exact", head: true })
      .eq("item_id", item_id);

    if (countError) {
      console.error("voteOnRoadmapItem [Count Error]", countError);
    }

    res.status(200).json({
      ok: true,
      vote_count: count || 0,
    });
  } catch (e: Error | any) {
    console.log("voteOnRoadmapItem [Error]", e);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
}
