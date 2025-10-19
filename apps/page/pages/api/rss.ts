import {
  convertMarkdownToHtml,
  convertMarkdownToPlainText,
} from "@changes-page/utils";
import { Feed } from "feed";
import type { NextApiRequest, NextApiResponse } from "next";
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

    const pageUrl = getPageUrl(page, settings);
    const { posts } = await fetchPosts(String(page?.id), {
      limit: Number(limit),
    });

    const feed = new Feed({
      title: page.title,
      description: page.description ?? "",
      id: pageUrl,
      link: pageUrl,
      language: "en",
      feedLinks: {
        atom: `${pageUrl}/feed.rss`,
      },
      copyright: `All rights reserved ${new Date().getFullYear()}, ${
        page.title
      }`,
      updated: new Date(),
    });

    const postsWithPlainTextContent = await Promise.all(
      (posts ?? []).map((post) => ({
        ...post,
        url: getPostUrl(pageUrl, post),
        content: convertMarkdownToPlainText(post.content),
        html: convertMarkdownToHtml(post.content),
      }))
    );

    for (const post of postsWithPlainTextContent) {
      feed.addItem({
        title: post.title,
        description: post.content,
        content: post.html,
        id: post.id,
        link: post.url,
        date: new Date(post.created_at),
      });
    }

    res.setHeader("Content-Type", "application/xml");
    res
      .status(200)
      .send((req?.url ?? "rss").includes("rss") ? feed.rss2() : feed.atom1());
  } catch (e: unknown) {
    console.log("feed.rss [Error]", e);
    res.status(500).send("Something went wrong");
  }
}

export default handler;
