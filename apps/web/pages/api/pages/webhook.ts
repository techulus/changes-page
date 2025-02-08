import { IPage } from "@changes-page/supabase/types/page";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { revalidatePage } from "../../../utils/revalidate";
import {
  createOrRetrievePageSettings,
  updateSubscriptionUsage,
} from "../../../utils/useDatabase";

const databaseWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      if (req?.headers["x-webhook-key"] !== process.env.SUPABASE_WEBHOOK_KEY) {
        return res
          .status(400)
          .json({ error: { statusCode: 500, message: "Invalid webhook key" } });
      }

      const { type, record, old_record } = req.body;

      const page: IPage = record || old_record;
      const { id, user_id } = page;

      console.log("Trigger databaseWebhook [Pages]: Record:", type, id);

      // report usage
      await updateSubscriptionUsage(user_id, `${type}-${id}-${v4()}`);

      // Revalidate
      await revalidatePage(page.url_slug);

      try {
        const settings = await createOrRetrievePageSettings(page.id);
        if (settings?.custom_domain) {
          await revalidatePage(settings.custom_domain);
        }
      } catch (err) {
        console.log(
          "Trigger databaseWebhook [Page]: Revalidation failed, failed to get page settings, maybe page is deleted?:",
          err
        );
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.log("Trigger databaseWebhook [Pages]: Error:", err);
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
