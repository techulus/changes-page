import { supabaseAdmin } from "@changespage/supabase/admin";
import { getAppBaseURL } from "../../utils/helpers";
import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

interface EventData {
  page_id: string;
  board_id: string;
  board_title: string;
  item_title: string;
}

export const sendRoadmapTriageNotification = inngestClient.createFunction(
  { name: "Email: Roadmap triage submission" },
  { event: "email/roadmap.triage-submitted" },
  async ({ event }) => {
    const { page_id, board_id, board_title, item_title }: EventData =
      event.data;

    console.log("Sending roadmap triage notification", {
      page_id,
      board_id,
      item_title,
    });

    const { data: page, error: pageError } = await supabaseAdmin
      .from("pages")
      .select(
        `
        title,
        user_id,
        page_settings(page_logo)
      `
      )
      .eq("id", page_id)
      .single();

    if (!page || pageError) {
      console.error("Error fetching page:", pageError);
      throw new Error("Page not found");
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(page.user_id);

    if (!authUser || authError || !authUser.user?.email) {
      console.error("Error fetching user:", authError);
      throw new Error("User not found or email missing");
    }

    const pageName = page.title;
    const pageLogoUrl = page.page_settings?.page_logo || null;
    const adminEmail = authUser.user.email;

    const triageUrl = `${getAppBaseURL()}/pages/${page_id}/roadmap/${board_id}`;

    const result = await postmarkClient.sendEmail({
      MessageStream: "outbound",
      From: "notification@mail.changes.page",
      To: adminEmail,
      Subject: `New roadmap idea submitted: ${item_title}`,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Roadmap Idea Submitted</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #4f46e5;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #4338ca;
            }
            .idea-box {
              background-color: #f9fafb;
              border-left: 4px solid #4f46e5;
              padding: 16px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .idea-title {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 8px;
              color: #111827;
            }
            .idea-description {
              color: #4b5563;
              margin: 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
            .meta-info {
              font-size: 14px;
              color: #6b7280;
              margin-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              ${
                pageLogoUrl
                  ? `<img src="${pageLogoUrl}" alt="${pageName}" style="max-width: 150px; height: auto; margin: 0 auto;"/>`
                  : `<h1 style="color: #4f46e5; margin: 0;">${pageName}</h1>`
              }
            </div>

            <h2>New roadmap idea submitted</h2>

            <p>A user has submitted a new idea to your roadmap: <strong>${board_title}</strong></p>

            <div class="idea-box">
              <div class="idea-title">${item_title}</div>
            </div>

            <div style="text-align: center;">
              <a href="${triageUrl}" class="button">View All Submissions</a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">You can review and approve this idea from your roadmap triage section.</p>

            <div class="footer">
              <p>This email was sent from ${pageName} via changes.page.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      TextBody: `
        New roadmap idea submitted

        A user has submitted a new idea to your roadmap: ${board_title}

        Title: ${item_title}

        View all submissions: ${triageUrl}

        You can review and approve this idea from your roadmap triage section.

        ---
        This email was sent from ${pageName} via changes.page.
      `,
    });

    return { body: "Roadmap triage notification sent", result };
  }
);
