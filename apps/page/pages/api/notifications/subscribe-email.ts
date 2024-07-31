import arcjet, { protectSignup } from "@arcjet/next";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../../lib/data";
import { subscribeViaEmail } from "../../../lib/notifications";
import { getPageUrl } from "../../../lib/url";
import inngestClient from "../../../utils/inngest";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean; message?: string } | null>
) {
  if (req.method === "POST") {
    const hostname = String(req?.headers?.host);
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ ok: false });
      return;
    }

    if (process.env.ARCJET_KEY) {
      const aj = arcjet({
        key: process.env.ARCJET_KEY,
        rules: [
          protectSignup({
            email: {
              mode: "LIVE",
              block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
            },
            bots: {
              mode: "LIVE",
              block: ["AUTOMATED"],
            },
            rateLimit: {
              mode: "LIVE",
              interval: "1m",
              max: 5,
            },
          }),
        ],
      });

      const decision = await aj.protect(req, {
        email,
      });

      if (decision.isDenied()) {
        console.log(
          "notifications/email: [Validation Error]",
          email,
          decision.reason
        );
        return res
          .status(400)
          .json({ ok: false, message: "Please provide a valid email address" });
      }
    }

    const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

    try {
      const { page, settings } = await fetchRenderData(
        String(domain || url_slug)
      );

      if (!page) throw new Error("Page not found");
      if (!settings) throw new Error("Settings not found");

      const pageUrl = getPageUrl(page, settings);

      if (!settings.email_notifications) {
        return res.status(400).json({ ok: false });
      }

      const result = await subscribeViaEmail(String(page?.id), String(email));

      // send email
      await inngestClient.send({
        name: "email/page.subscribe",
        data: {
          email: result.email,
          payload: {
            // page
            page_url: getPageUrl(page, settings),
            page_title: page.title,
            page_logo:
              settings.page_logo ?? "https://changes.page/images/logo.png",
            // subscription
            confirm_link: `${pageUrl}/notifications/confirm-email-subscription?email=${encodeURIComponent(
              result.email
            )}&token=${result.recipient_id}&page_id=${page.id}`,
          },
          metadata: {
            campaign: "subscribe",
            page_id: page.id,
          },
        },
      });

      res.status(200).json({ ok: true });
    } catch (e: Error | any) {
      console.log("notifications/email: [Error]", e);
      res.status(400).json({ ok: false, message: e.message ?? String(e) });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default handler;
