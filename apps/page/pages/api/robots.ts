import type { NextApiRequest, NextApiResponse } from "next";
import { fetchRenderData, translateHostToPageIdentifier } from "../../lib/data";

const ALLOW = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/`;

const DISALLOW = `User-agent: *
Disallow: /`;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | null>,
) {
  const hostname = String(req?.headers?.host);

  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  res.setHeader("Content-Type", "text/plain; charset=UTF-8");

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug),
    );

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    res.status(200).send(settings?.hide_search_engine ? DISALLOW : ALLOW);
  } catch (e: unknown) {
    console.log("robots.txt [Error]", e);
    res.status(200).send(DISALLOW);
  }
}

export default handler;
