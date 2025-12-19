import arcjet, { detectBot, tokenBucket } from "@arcjet/next";
import { supabaseAdmin } from "@changespage/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { escape } from "validator";
import { getAuthenticatedVisitor } from "../../../lib/visitor-auth";
import inngestClient from "../../../utils/inngest";

const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        tokenBucket({
          mode: "LIVE",
          characteristics: ["userId"],
          refillRate: 5,
          interval: "1h",
          capacity: 10,
        }),
        detectBot({
          mode: "LIVE",
          block: ["AUTOMATED"],
        }),
      ],
    })
  : undefined;

export default async function submitTriageItem(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; item?: any; error?: string }>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { board_id, title, description } = req.body;

  if (!board_id) {
    return res.status(400).json({ success: false, error: "Missing board_id" });
  }

  if (!title || typeof title !== "string") {
    return res.status(400).json({ success: false, error: "Title is required" });
  }

  const trimmedTitle = title.trim();
  const trimmedDescription =
    description && typeof description === "string" ? description.trim() : null;

  if (!trimmedTitle) {
    return res
      .status(400)
      .json({ success: false, error: "Title cannot be empty" });
  }

  if (trimmedTitle.length > 200) {
    return res
      .status(400)
      .json({ success: false, error: "Title must be 200 characters or less" });
  }

  if (trimmedDescription && trimmedDescription.length > 2000) {
    return res.status(400).json({
      success: false,
      error: "Description must be 2000 characters or less",
    });
  }

  const visitor = await getAuthenticatedVisitor(req);

  if (!visitor) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }

  if (aj) {
    const decision = await aj.protect(req, {
      userId: visitor.id,
      requested: 1,
    });

    if (decision.isDenied()) {
      console.log(
        "roadmap/submit-triage: [Arcjet Block]",
        visitor.id,
        decision.reason
      );

      return res.status(403).json({
        success: false,
        error: "Request blocked.",
      });
    }
  }

  try {
    const { data: board, error: boardCheckError } = await supabaseAdmin
      .from("roadmap_boards")
      .select("id, is_public, title, page_id")
      .eq("id", board_id)
      .eq("is_public", true)
      .maybeSingle();

    if (boardCheckError || !board) {
      return res
        .status(404)
        .json({ success: false, error: "Board not found or not public" });
    }

    const { data: triageItem, error: insertError } = await supabaseAdmin
      .from("roadmap_triage_items")
      .insert({
        id: v4(),
        board_id: String(board_id),
        title: trimmedTitle,
        description: trimmedDescription,
        visitor_id: visitor.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("submitTriageItem [Insert Error]", insertError);
      return res
        .status(500)
        .json({ success: false, error: "Failed to submit item" });
    }

    try {
      await inngestClient.send({
        name: "email/roadmap.triage-submitted",
        data: {
          page_id: board.page_id,
          board_id: board.id,
          board_title: board.title,
          item_title: escape(trimmedTitle),
        },
      });
    } catch (emailError) {
      console.error("submitTriageItem [Email Error]", emailError);
    }

    res.status(200).json({
      success: true,
      item: triageItem,
    });
  } catch (e: unknown) {
    console.log("submitTriageItem [Error]", e);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
