import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

export const sendPostNotification = inngestClient.createFunction(
  { name: "Email: Post publish notification" },
  { event: "email/page.publish" },
  async ({ event }) => {
    const { email, payload, metadata, replyTo } = event.data;

    console.log("Job started", {
      email,
      metadata,
    });

    const result = await postmarkClient.sendEmailWithTemplate({
      MessageStream: "broadcast",
      From: "notification@mail.changes.page",
      To: email,
      ReplyTo: replyTo,
      TemplateAlias: "post-notification",
      TemplateModel: payload,
      Metadata: metadata,
    });

    return { body: "Job completed", result };
  }
);
