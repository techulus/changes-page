import { supabaseAdmin } from "@changespage/supabase/admin";
import { Parser } from "@json2csv/plainjs";
import { apiRateLimiter } from "../../../../utils/rate-limit";
import { withAuth } from "../../../../utils/withAuth";

const getSubscribersExportCsv = withAuth(async (req, res, { user }) => {
  if (req.method === "GET") {
    try {
      await apiRateLimiter(req, res);

      const page_id = String(req.query.page_id);

      await supabaseAdmin
        .from("pages")
        .select("id")
        .eq("id", page_id)
        .eq("user_id", user.id)
        .single();

      const { data, error } = await supabaseAdmin
        .from("page_email_subscribers")
        .select("email, created_at")
        .eq("page_id", page_id)
        .eq("status", "verified");

      if (error) {
        console.error(error);
        throw new Error("Failed to get email subscribers");
      }

      const parser = new Parser();
      const csv = parser.parse(data);

      return res
        .status(200)
        .setHeader("Content-Type", "text/csv")
        .setHeader(
          "Content-Disposition",
          `attachment; filename=export-${Date.now()}.csv`
        )
        .send(csv);
    } catch (err) {
      console.log("getEmailSubscribers: Error:", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
});

export default getSubscribersExportCsv;
