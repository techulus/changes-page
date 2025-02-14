import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

export const sendTeamInviteEmail = inngestClient.createFunction(
  { name: "Email: Team Invite" },
  { event: "email/team.invite" },
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
      TemplateAlias: "team-invite",
      TemplateModel: payload,
    });

    return { body: "Job completed", result };
  }
);
