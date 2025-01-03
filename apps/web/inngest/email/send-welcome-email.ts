import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

export const sendWelcomeEmail = inngestClient.createFunction(
  { name: "Email: Welcome" },
  { event: "email/user.welcome" },
  async ({ event }) => {
    const { email, payload } = event.data;

    console.log("Job started", {
      email,
      payload,
    });

    const result = await postmarkClient.sendEmailWithTemplate({
      MessageStream: "outbound",
      From: "hello@changes.page",
      To: email,
      TemplateAlias: "welcome-user",
      TemplateModel: payload,
    });

    return { body: "Job completed", result };
  }
);
