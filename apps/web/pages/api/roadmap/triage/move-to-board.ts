import { supabaseAdmin } from "@changes-page/supabase/admin";
import { v4 } from "uuid";
import { withAuth } from "../../../../utils/withAuth";
import { createAuditLog } from "../../../../utils/auditLog";

const moveTriageToBoard = withAuth<{ success: boolean; item?: any; error?: string }>(
  async (req, res, { supabase, user }) => {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { triage_item_id } = req.body;

    if (!triage_item_id) {
      return res.status(400).json({ success: false, error: "Missing triage_item_id" });
    }

    try {
    const { data: triageItem, error: triageError } = await supabaseAdmin
      .from("roadmap_triage_items")
      .select("*, roadmap_boards!inner(id, page_id, pages!inner(id, user_id))")
      .eq("id", triage_item_id)
      .single();

    if (triageError || !triageItem) {
      return res.status(404).json({ success: false, error: "Triage item not found" });
    }

    if (triageItem.roadmap_boards.pages.user_id !== user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { data: firstColumn, error: columnError } = await supabaseAdmin
      .from("roadmap_columns")
      .select("id")
      .eq("board_id", triageItem.board_id)
      .order("position", { ascending: true })
      .limit(1)
      .single();

    if (columnError || !firstColumn) {
      return res.status(500).json({ success: false, error: "Failed to find first column" });
    }

    const { data: columnItems, error: itemsError } = await supabaseAdmin
      .from("roadmap_items")
      .select("position")
      .eq("column_id", firstColumn.id)
      .order("position", { ascending: false })
      .limit(1);

    if (itemsError) {
      return res.status(500).json({ success: false, error: "Failed to calculate position" });
    }

    const maxPosition = columnItems && columnItems.length > 0 ? columnItems[0].position : 0;

    const { data: newItem, error: insertError } = await supabaseAdmin
      .from("roadmap_items")
      .insert({
        id: v4(),
        board_id: triageItem.board_id,
        column_id: firstColumn.id,
        title: triageItem.title,
        description: triageItem.description,
        category_id: null,
        position: maxPosition + 1,
      })
      .select(
        `*,
        roadmap_categories (
          id,
          name,
          color
        ),
        roadmap_votes (
          id
        )`
      )
      .single();

    if (insertError) {
      console.error("moveTriageToBoard [Insert Error]", insertError);
      return res.status(500).json({ success: false, error: "Failed to create roadmap item" });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("roadmap_triage_items")
      .delete()
      .eq("id", triage_item_id);

    if (deleteError) {
      console.error("moveTriageToBoard [Delete Error]", deleteError);
    }

    try {
      await createAuditLog(supabase, {
        page_id: triageItem.roadmap_boards.page_id,
        actor_id: user.id,
        action: `Moved Triage Item to Board: ${newItem.title}`,
        changes: { triage_item_id, roadmap_item_id: newItem.id },
      });
    } catch (auditError) {
      console.error("moveTriageToBoard [Audit Log Error]", auditError);
    }

    res.status(200).json({
      success: true,
      item: newItem,
    });
    } catch (e: Error | any) {
      console.log("moveTriageToBoard [Error]", e);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

export default moveTriageToBoard;
