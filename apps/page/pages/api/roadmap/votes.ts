import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

type BulkVotesResponse = {
  success: boolean;
  votes: Record<string, { vote_count: number; user_voted: boolean }>;
};

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function getBulkRoadmapItemVotes(
  req: NextApiRequest,
  res: NextApiResponse<BulkVotesResponse>
) {
  // Validate HTTP method
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, votes: {} });
  }

  const { item_ids } = req.body;
  let { cp_pa_vid: visitor_id } = req.cookies;

  // Input validation
  if (!item_ids || !Array.isArray(item_ids)) {
    return res.status(400).json({ success: false, votes: {} });
  }

  // Prevent abuse with max array length
  if (item_ids.length > 100) {
    return res.status(400).json({ success: false, votes: {} });
  }

  // Validate all item_ids are valid UUIDs
  if (!item_ids.every((id) => typeof id === "string" && UUID_REGEX.test(id))) {
    return res.status(400).json({ success: false, votes: {} });
  }

  // De-duplicate to keep queries lean
  const distinctItemIds: string[] = Array.from(new Set(item_ids));
  if (distinctItemIds.length === 0) {
    return res.status(200).json({ success: true, votes: {} });
  }

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    // Use a more efficient approach: get counts per item using a GROUP BY-like query
    const voteCountPromises = distinctItemIds.map((itemId) =>
      supabaseAdmin
        .from("roadmap_votes")
        .select("id", { count: "exact", head: true })
        .eq("item_id", itemId)
    );

    const [userVoteResult, ...voteCountResults] = await Promise.all([
      supabaseAdmin
        .from("roadmap_votes")
        .select("item_id")
        .in("item_id", distinctItemIds)
        .eq("visitor_id", visitor_id),
      ...voteCountPromises,
    ]);

    if (userVoteResult.error) {
      console.error(
        "getBulkRoadmapItemVotes [User Error]",
        userVoteResult.error
      );
      return res.status(500).json({ success: false, votes: {} });
    }

    // Check for any errors in vote count queries
    for (let i = 0; i < voteCountResults.length; i++) {
      if (voteCountResults[i].error) {
        console.error(
          "getBulkRoadmapItemVotes [Count Error for %s]",
          distinctItemIds[i],
          voteCountResults[i].error
        );
        return res.status(500).json({ success: false, votes: {} });
      }
    }

    // Create vote counts map from the database counts
    const voteCountsMap: Record<string, number> = {};
    distinctItemIds.forEach((itemId, index) => {
      voteCountsMap[itemId] = voteCountResults[index].count || 0;
    });

    const userVotedSet = new Set(
      (userVoteResult.data || []).map((vote) => vote.item_id)
    );

    const votes: Record<string, { vote_count: number; user_voted: boolean }> =
      {};
    item_ids.forEach((itemId: string) => {
      votes[itemId] = {
        vote_count: voteCountsMap[itemId] || 0,
        user_voted: userVotedSet.has(itemId),
      };
    });

    res.status(200).json({
      success: true,
      votes,
    });
  } catch (e: unknown) {
    console.log("getBulkRoadmapItemVotes [Error]", e);
    res.status(500).json({ success: false, votes: {} });
  }
}
