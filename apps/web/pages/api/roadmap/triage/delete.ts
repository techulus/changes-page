import { supabaseAdmin } from "@changespage/supabase/admin";
import { createAuditLog } from "../../../../utils/auditLog";
import { withAuth } from "../../../../utils/withAuth";

const deleteTriageItem = withAuth<{ success: boolean; error?: string }>(
  async (req, res, { supabase, user }) => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
    }

    const { triage_item_id } = req.body;

    if (!triage_item_id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing triage_item_id" });
    }

    try {
      const { data: triageItem, error: triageError } = await supabaseAdmin
        .from("roadmap_triage_items")
        .select(
          "*, roadmap_boards!inner(id, page_id, pages!inner(id, user_id))"
        )
        .eq("id", triage_item_id)
        .single();

      if (triageError || !triageItem) {
        return res
          .status(404)
          .json({ success: false, error: "Triage item not found" });
      }

      if (triageItem.roadmap_boards.pages.user_id !== user.id) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
      }

      const { error: deleteError } = await supabaseAdmin
        .from("roadmap_triage_items")
        .delete()
        .eq("id", triage_item_id);

      if (deleteError) {
        console.error("deleteTriageItem [Delete Error]", deleteError);
        return res
          .status(500)
          .json({ success: false, error: "Failed to delete triage item" });
      }

      try {
        await createAuditLog(supabase, {
          page_id: triageItem.roadmap_boards.page_id,
          actor_id: user.id,
          action: `Deleted Triage Item: ${triageItem.title}`,
          changes: { triage_item_id, title: triageItem.title },
        });
      } catch (auditError) {
        console.error("deleteTriageItem [Audit Log Error]", auditError);
      }

      res.status(200).json({
        success: true,
      });
    } catch (e: unknown) {
      console.log("deleteTriageItem [Error]", e);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

export default deleteTriageItem;
