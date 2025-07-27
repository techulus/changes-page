import { supabaseAdmin } from "@changes-page/supabase/admin";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

interface CleanupResponse {
  status: string;
  deletedPages: number;
  jobId: string;
}

const cleanupInactivePagesJob = async (
  req: NextApiRequest,
  res: NextApiResponse<CleanupResponse | IErrorResponse>
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: { statusCode: 405, message: "Method not allowed" } });
  }

  try {
    const jobId = v4();

    console.log(`[${jobId}] Starting cleanup inactive pages job`);

    const { data: inactivePages, error: fetchError } = await supabaseAdmin.rpc(
      "get_pages_with_inactive_subscriptions"
    );

    if (fetchError) {
      console.error(`[${jobId}] Error fetching inactive pages:`, fetchError);
      throw fetchError;
    }

    const allInactivePages = inactivePages || [];

    console.log(
      `[${jobId}] Found ${allInactivePages.length} pages from inactive users to delete`
    );

    if (allInactivePages.length === 0) {
      console.log(`[${jobId}] No pages to delete`);
      return res.status(200).json({
        status: "ok",
        deletedPages: 0,
        jobId,
      });
    }

    const pageIdsToDelete = allInactivePages.map((page) => page.page_id);

    console.log(`[${jobId}] Deleting ${pageIdsToDelete.length} pages`);
    const { error: pagesDeleteError } = await supabaseAdmin
      .from("pages")
      .delete()
      .in("id", pageIdsToDelete);

    if (pagesDeleteError) {
      console.error(`[${jobId}] Error deleting pages:`, pagesDeleteError);
      throw pagesDeleteError;
    }

    console.log(
      `[${jobId}] Successfully deleted ${pageIdsToDelete.length} pages and related data`
    );

    // Log deleted pages for audit purposes
    allInactivePages.forEach((page) => {
      console.log(
        `[${jobId}] Deleted page: ${page.page_title} (ID: ${page.page_id}) from user: ${page.user_id}`
      );
    });

    console.log(`[${jobId}] Cleanup job finished successfully`);

    return res.status(200).json({
      status: "ok",
      deletedPages: pageIdsToDelete.length,
      jobId,
    });
  } catch (err) {
    console.error("cleanupInactivePagesJob error:", err);
    res.status(500).json({
      error: {
        statusCode: 500,
        message: err.message || "Internal server error",
      },
    });
  }
};

export default cleanupInactivePagesJob;
