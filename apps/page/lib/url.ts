import slugify from "slugify";
import { IPage, IPageSettings, IPost } from "@changes-page/supabase/types/page";

export function getPageUrl(
  page: IPage,
  settings: IPageSettings,
  hostname: string | null = null
) {
  if (hostname === "localhost:3000") {
    return "http://localhost:3000";
  }

  if (hostname?.includes("vercel.app")) {
    return `https://${hostname}`;
  }

  if (settings.custom_domain) {
    return `https://${settings.custom_domain}`;
  }

  return `https://${page.url_slug}.changes.page`;
}

export function getPostUrl(pageUrl: string, post: IPost) {
  return `${pageUrl}/post/${post.id}/${slugify(post.title, {
    lower: true,
    strict: true,
  })}`;
}
export function getOgUrl(
  page: IPage,
  settings: IPageSettings,
  post: IPost | null = null,
  content: string = ""
) {
  const pageUrl = getPageUrl(page, settings);

  if (post && content.length) {
    // truncate content to 200 characters
    const contentTruncated =
      content.length > 350 ? content.substring(0, 350) + "..." : content;

    return `${pageUrl}/api/og?title=${page?.title}&body=${
      post.title
    }&content=${contentTruncated}${
      settings?.page_logo ? "&logo=" + settings?.page_logo : ""
    }`;
  }

  return `${pageUrl}/api/og?title=${page?.title}&body=${page.description}${
    settings?.page_logo ? "&logo=" + settings?.page_logo : ""
  }`;
}
