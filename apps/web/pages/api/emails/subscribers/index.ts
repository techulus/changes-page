import { supabaseAdmin } from "@changes-page/supabase/admin";
import { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClientForAPI } from "../../../../utils/supabase/supabase-admin";

const getEmailSubscribers = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    try {
      const { user } = await getSupabaseServerClientForAPI({ req, res });

      const page_id = String(req.query.page_id);

      await supabaseAdmin
        .from("pages")
        .select("id")
        .eq("id", page_id)
        .eq("user_id", user.id)
        .single();

      const { count, error } = await supabaseAdmin
        .from("page_email_subscribers")
        .select("page_id", { count: "exact" })
        .eq("page_id", page_id);

      if (error) {
        console.error(error);
        throw new Error("Failed to get email subscribers");
      }

      return res.status(200).json({ count });
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
};

export default getEmailSubscribers;
