import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import slugify from "slugify";
import { IPostPublicData } from "./data";

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

export function getPostUrl(
  pageUrl: string,
  post: Pick<IPostPublicData, "id" | "title">
) {
  return `${pageUrl}/post/${post.id}/${slugify(post.title, {
    lower: true,
    strict: true,
  })}`;
}

export function getOgUrl(
  page: IPage,
  settings: IPageSettings,
  title: string | null,
  description: string | null
) {
  const pageUrl = getPageUrl(page, settings);

  if (title?.length && description?.length) {
    const contentTruncated =
      description.length > 350
        ? description.substring(0, 350) + "..."
        : description;

    return `${pageUrl}/api/og?title=${encodeURIComponent(
      page?.title
    )}&body=${encodeURIComponent(title)}&content=${encodeURIComponent(
      contentTruncated
    )}${settings?.page_logo ? "&logo=" + settings?.page_logo : ""}`;
  }

  return `${pageUrl}/api/og?title=${encodeURIComponent(
    page?.title
  )}&body=${encodeURIComponent(description ?? page.description ?? "")}${
    settings?.page_logo ? "&logo=" + settings?.page_logo : ""
  }`;
}
