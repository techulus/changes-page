import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

export const sendConfirmEmailNotification = inngestClient.createFunction(
  { name: "Email: Confirm subscription" },
  { event: "email/page.subscribe" },
  async ({ event }) => {
    const { email, payload, metadata } = event.data;

    console.log("Job started", {
      email,
      payload,
      metadata,
    });

    const result = await postmarkClient.sendEmailWithTemplate({
      MessageStream: "outbound",
      From: "notification@changes.page",
      To: email,
      TemplateAlias: "confirm-subscribe",
      TemplateModel: payload,
      Metadata: metadata,
    });

    return { body: "Job completed", result };
  }
);
