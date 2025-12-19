import { supabaseAdmin } from "@changespage/supabase/admin";
import inngestClient from "../../utils/inngest";
import postmarkClient from "../../utils/postmark";

interface EventData {
  email: string;
  verification_token: string;
  page_url: string;
  page_id?: string | null;
}

export const sendVisitorMagicLink = inngestClient.createFunction(
  { name: "Email: Send visitor magic link" },
  { event: "email/visitor.magic-link" },
  async ({ event }) => {
    const { email, verification_token, page_url, page_id }: EventData =
      event.data;

    console.log("Sending magic link email", {
      page_url,
      page_id,
    });

    if (!page_id) {
      throw new Error("Missing page_id");
    }

    const { data: page, error: pageError } = await supabaseAdmin
      .from("pages")
      .select("title, page_settings(page_logo)")
      .eq("id", page_id)
      .maybeSingle();
    if (!page || pageError) {
      console.error("Error fetching page:", pageError);
      throw new Error("Page not found");
    }

    const pageName = page.title;
    const pageLogoUrl = page.page_settings?.page_logo || null;

    const magicLinkUrl = new URL(page_url);
    magicLinkUrl.pathname = "/auth/verify";
    magicLinkUrl.searchParams.set("token", verification_token);

    // avoid catching error here so that inngest can retry
    const result = await postmarkClient.sendEmail({
      MessageStream: "outbound",
      From: "no-reply@changes.page",
      To: email,
      Subject: `Sign in to ${pageName}`,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Magic Link</title>
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
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
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

            <h2>Complete your sign-in</h2>

            <p>Hi there!</p>

            <p>You requested to sign in to ${pageName}. Click the button below to complete your authentication:</p>

            <div style="text-align: center;">
              <a href="${magicLinkUrl.toString()}" class="button">Sign In</a>
            </div>

            <div class="warning">
              <strong>Note:</strong> This link will expire in 15 minutes and can only be used once.
            </div>

            <p>If you didn't request this email, you can safely ignore it.</p>

            <p>If you're having trouble with the button above, you can also copy and paste this link into your browser:</p>
            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 14px;">
              ${magicLinkUrl.toString()}
            </p>

            <div class="footer">
              <p>This email was sent on behalf of ${pageName} via changes.page.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      TextBody: `
        Complete your sign-in to ${pageName}

        Hi there!

        You requested to sign in to ${pageName}. Click or copy the link below to complete your authentication:

        ${magicLinkUrl.toString()}

        This link will expire in 15 minutes and can only be used once.

        If you didn't request this email, you can safely ignore it.

        ---
        This email was sent on behalf of ${pageName} via changes.page.
      `,
    });

    return { body: "Magic link email sent", result };
  }
);
