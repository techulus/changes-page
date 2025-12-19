import { IErrorResponse } from "@changespage/supabase/types/api";
import { URL_SLUG_REGEX } from "@changespage/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { validatePageByUrl } from "../../../utils/useDatabase";

const BLACKLIST = [
  "www",
  "app",
  "support",
  "help",
  "account",
  "create",
  "new",
  "login",
  "code",
  "status",
  "cname",
  "domain",
  "domains",
  "billing",
  "api",
  "dashboard",
  "settings",
  "admin",
  "administrator",
  "user",
  "users",
  "profile",
  "profiles",
  "about",
  "contact",
  "privacy",
  "terms",
  "tos",
  "security",
  "open",
  "manage",
  "affiliate",
  "blog",
  "store",
  "shop",
  "download",
  "downloads",
  "docs",
  "documentation",
  "knowledge",
  "knowledgebase",
  "faq",
  "faqs",
  "forum",
  "forums",
  "chat",
  "chats",
  "live",
  "livechat",
  "live-chat",
  "live-support",
  "git",
  "news",
  "newsletter",
  "newsletters",
  "email",
  "emails",
  "mail",
  "mails",
  "smtp",
  "press",
  "presskit",
  "press-kit",
];

const validatePageUrl = async (
  req: NextApiRequest,
  res: NextApiResponse<{ status: boolean } | IErrorResponse>
) => {
  if (req.method === "POST") {
    await apiRateLimiter(req, res);

    const { url_slug, page_id } = req.body;

    console.log("validatePageUrl", { url_slug, page_id });

    if (BLACKLIST.includes(url_slug)) {
      return res.status(200).json({ status: false });
    }

    if (!URL_SLUG_REGEX.test(url_slug)) {
      return res.status(200).json({ status: false });
    }

    try {
      const okay = await validatePageByUrl(url_slug, page_id);

      return res.status(200).json({ status: okay });
    } catch (err) {
      console.log("validatePageUrl", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default validatePageUrl;
