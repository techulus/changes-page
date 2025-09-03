import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

type BulkVotesResponse = {
  ok: boolean;
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
    return res.status(405).json({ ok: false, votes: {} });
  }

  const { item_ids } = req.body;
  let { cp_pa_vid: visitor_id } = req.cookies;

  // Input validation
  if (!item_ids || !Array.isArray(item_ids)) {
    return res.status(400).json({ ok: false, votes: {} });
  }

  // Prevent abuse with max array length
  if (item_ids.length > 100) {
    return res.status(400).json({ ok: false, votes: {} });
  }

  // Validate all item_ids are valid UUIDs
  if (!item_ids.every((id) => typeof id === "string" && UUID_REGEX.test(id))) {
    return res.status(400).json({ ok: false, votes: {} });
  }

  if (!visitor_id) {
    visitor_id = v4();
    res.setHeader(
      "Set-Cookie",
      `cp_pa_vid=${visitor_id}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`
    );
  }

  try {
    const [voteCountResult, userVoteResult] = await Promise.all([
      supabaseAdmin
        .from("roadmap_votes")
        .select("item_id")
        .in("item_id", item_ids),
      supabaseAdmin
        .from("roadmap_votes")
        .select("item_id")
        .in("item_id", item_ids)
        .eq("visitor_id", visitor_id),
    ]);

    if (voteCountResult.error) {
      console.error(
        "getBulkRoadmapItemVotes [Count Error]",
        voteCountResult.error
      );
      return res.status(500).json({ ok: false, votes: {} });
    }

    if (userVoteResult.error) {
      console.error(
        "getBulkRoadmapItemVotes [User Error]",
        userVoteResult.error
      );
      return res.status(500).json({ ok: false, votes: {} });
    }

    const voteCountsMap = (voteCountResult.data || []).reduce((acc, vote) => {
      acc[vote.item_id] = (acc[vote.item_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
      ok: true,
      votes,
    });
  } catch (e: Error | any) {
    console.log("getBulkRoadmapItemVotes [Error]", e);
    res.status(500).json({ ok: false, votes: {} });
  }
}
