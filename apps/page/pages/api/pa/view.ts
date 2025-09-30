import type { NextApiRequest, NextApiResponse } from "next";
import UAParser from "ua-parser-js";
import { v4 } from "uuid";
import {
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../../lib/data";
import { supabaseAdmin } from "@changes-page/supabase/admin";
import { getVisitorId, setLegacyVisitorCookie } from "../../../lib/visitor-auth";

async function pageAnalyticsView(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean }>
) {
  // Ignore bots
  if (String(req?.headers["user-agent"]).toLowerCase().includes("bot")) {
    return res.status(200).json({ ok: true });
  }

  const hostname = String(req?.headers?.host);
  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  const { page_path, referrer } = req.body;

  const visitor_id = await getVisitorId(req);

  if (!req.cookies.cp_visitor_token && !req.cookies.cp_pa_vid) {
    setLegacyVisitorCookie(res, visitor_id);
  }

  try {
    const { page } = await fetchRenderData(String(domain || url_slug));

    const parser = new UAParser(req.headers["user-agent"]);

    const { error } = await supabaseAdmin.from("page_views").insert([
      {
        page_id: String(page?.id ?? ""),
        visitor_id: visitor_id ?? v4(),
        page_path: page_path ?? "/",
        referrer,
        os: parser.getOS().name,
        browser: parser.getBrowser().name,
        user_agent: req.headers["user-agent"],
      },
    ]);

    if (error) {
      console.error("pageAnalyticsView [Error]", error);
    }

    res.status(200).json({ ok: true });
  } catch (e: Error | any) {
    console.log("pageAnalyticsView [Error]", e);
    res.status(200).json({ ok: true });
  }
}

export default pageAnalyticsView;
