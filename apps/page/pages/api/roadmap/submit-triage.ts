import { supabaseAdmin } from "@changes-page/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { getAuthenticatedVisitor } from "../../../lib/visitor-auth";

export default async function submitTriageItem(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; item?: any; error?: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { board_id, title, description } = req.body;

  if (!board_id) {
    return res.status(400).json({ success: false, error: "Missing board_id" });
  }

  if (!title || typeof title !== "string") {
    return res.status(400).json({ success: false, error: "Title is required" });
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description && typeof description === "string" ? description.trim() : null;

  if (!trimmedTitle) {
    return res.status(400).json({ success: false, error: "Title cannot be empty" });
  }

  if (trimmedTitle.length > 200) {
    return res.status(400).json({ success: false, error: "Title must be 200 characters or less" });
  }

  if (trimmedDescription && trimmedDescription.length > 2000) {
    return res.status(400).json({ success: false, error: "Description must be 2000 characters or less" });
  }

  const visitor = await getAuthenticatedVisitor(req);

  if (!visitor) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const { data: boardCheck, error: boardCheckError } = await supabaseAdmin
      .from("roadmap_boards")
      .select("id, is_public")
      .eq("id", board_id)
      .eq("is_public", true)
      .maybeSingle();

    if (boardCheckError || !boardCheck) {
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
      return res.status(500).json({ success: false, error: "Failed to submit item" });
    }

    res.status(200).json({
      success: true,
      item: triageItem,
    });
  } catch (e: Error | any) {
    console.log("submitTriageItem [Error]", e);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
