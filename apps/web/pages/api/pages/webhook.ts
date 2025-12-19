import { IPage } from "@changespage/supabase/types/page";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { DELETE_IMAGES_JOB_EVENT } from "../../../inngest/jobs/delete-images";
import inngestClient from "../../../utils/inngest";
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

      try {
        await createOrRetrievePageSettings(page.id);
      } catch (err) {
        console.log(
          "Trigger databaseWebhook [Page]: Revalidation failed, failed to get page settings, maybe page is deleted?:",
          err
        );
      }

      if (type === "DELETE") {
        console.log("Trigger databaseWebhook [Page]: Deleting images");
        await inngestClient.send({
          name: DELETE_IMAGES_JOB_EVENT,
          data: {
            path: `${user_id}/${page.id}`,
          },
        });
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
