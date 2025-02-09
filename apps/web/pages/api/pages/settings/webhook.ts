import { IPageSettings } from "@changes-page/supabase/types/page";
import { NextApiRequest, NextApiResponse } from "next";

const databaseWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      if (req?.headers["x-webhook-key"] !== process.env.SUPABASE_WEBHOOK_KEY) {
        return res
          .status(400)
          .json({ error: { statusCode: 500, message: "Invalid webhook key" } });
      }

      const { type, record, old_record } = req.body;

      const page_settings: IPageSettings = record || old_record;
      const { page_id } = page_settings;

      console.log(
        "Trigger databaseWebhook [Page Settings]: Record:",
        type,
        page_id
      );

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.log("Trigger databaseWebhook [Page Settings]: Error:", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default databaseWebhook;
