import type { NextApiRequest, NextApiResponse } from "next";
import { SitemapStream, streamToPromise } from "sitemap";
import {
  fetchPosts,
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../lib/data";
import { getPageUrl, getPostUrl } from "../../lib/url";

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const hostname = String(req?.headers?.host);
  const { limit } = req?.query;

  const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

  try {
    const { page, settings } = await fetchRenderData(
      String(domain || url_slug)
    );

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    if (settings?.hide_search_engine) {
      res.status(404).json("Not found");
      return;
    }

    const pageUrl = getPageUrl(page, settings);
    const { posts } = await fetchPosts(String(page?.id), {
      limit: Number(limit),
    });

    const sitemap = new SitemapStream({ hostname: pageUrl });

    for (const post of posts ?? []) {
      const postUrl = getPostUrl(pageUrl, post);
      sitemap.write({
        url: postUrl,
        changefreq: "weekly",
        priority: 0.5,
        lastmodISO: new Date(post.updated_at).toISOString(),
        links: [{ lang: "en", url: postUrl }],
      });
    }

    sitemap.end();

    const result = await streamToPromise(sitemap);

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("content-disposition", 'inline; filename="sitemap.xml"');
    res.status(200).send(result.toString());
  } catch (e: unknown) {
    console.log("Sitemap [Error]", e);
    res.status(500).send("Something went wrong");
  }
}

export default handler;
