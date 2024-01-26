import { NextApiRequest, NextApiResponse } from "next";
import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import { DELETE_IMAGES_JOB_EVENT } from "../../../inngest/jobs/delete-images";
import { sendPostEmailToSubscribers } from "../../../utils/email";
import inngestClient from "../../../utils/inngest";
import { revalidatePage } from "../../../utils/revalidate";
import { supabaseAdmin } from "../../../utils/supabase/supabase-admin";
import {
  createOrRetrievePageSettings,
  getPageById,
  reportEmailUsage,
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
      const post: IPost = record || old_record;

      const { id, user_id, page_id, status, email_notified, images_folder } =
        post;

      console.log("Trigger databaseWebhook [Posts]: Record:", type, id);

      if (type === "DELETE") {
        console.log("Trigger databaseWebhook [Posts]: Deleting images");
        await inngestClient.send({
          name: DELETE_IMAGES_JOB_EVENT,
          data: {
            path: `${user_id}/${page_id}/${images_folder}`,
          },
        });

        try {
          const page = await getPageById(page_id);
          const settings = await createOrRetrievePageSettings(user_id, page_id);
          // Revalidate
          await revalidatePage(page.url_slug);
          if (settings?.custom_domain) {
            await revalidatePage(settings.custom_domain);
          }
        } catch (err) {
          console.log(
            "Trigger databaseWebhook [Posts]: Error revalidating page, most likely its deleted:",
            err
          );
        }

        return res.status(200).json({ ok: true });
      }

      const page = await getPageById(page_id);
      const settings = await createOrRetrievePageSettings(user_id, page_id);

      /**
       * BE VERY CAREFUL, THIS IS A VERY IMPORTANT LOGIC
       *
       * UPDATING POSTS FROM WEBHOOK COULD RESULT IN INFINITE LOOPS
       */
      if (type === "INSERT" || type === "UPDATE") {
        // Handle email notifications
        if (
          settings?.email_notifications &&
          status === PostStatus.published &&
          !email_notified
        ) {
          await sendPostEmailToSubscribers(post, page, settings)
            .then(() =>
              console.log(
                "sendPostEmailToSubscribers completed:",
                page?.id,
                record?.id
              )
            )
            .catch((e) =>
              console.log("sendPostEmailToSubscribers failed:", page, record, e)
            );

          await reportEmailUsage(user_id, page_id, id);
        }

        // Mark post as notified if email notifications are disabled and post is published
        if (
          !settings?.email_notifications &&
          status === PostStatus.published &&
          !email_notified
        ) {
          await supabaseAdmin
            .from("posts")
            .update({ email_notified: true })
            .match({ id: post.id });
        }

        // Revalidate
        await revalidatePage(page.url_slug);
        if (settings?.custom_domain) {
          await revalidatePage(settings.custom_domain);
        }
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.log("Trigger databaseWebhook [Posts]: Error:", err);
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
