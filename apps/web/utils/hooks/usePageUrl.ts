import { IPage, IPageSettings, IPost } from "@changes-page/supabase/types/page";
import { useCallback, useMemo } from "react";
import slugify from "slugify";

export function getPageUrl(page, settings) {
  // return "http://localhost:3000";

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

export default function usePageUrl(
  page: Pick<IPage, "url_slug">,
  settings: Pick<IPageSettings, "custom_domain">
) {
  const pageUrl = useMemo(() => {
    if (!page || !settings) return null;

    if (settings.custom_domain) {
      return `https://${settings.custom_domain}`;
    }

    return `https://${page.url_slug}.changes.page`;
  }, [page, settings]);

  const postUrl = useCallback(
    (post: IPost) => getPostUrl(pageUrl, post),
    [pageUrl]
  );

  return {
    pageUrl,
    getPostUrl: postUrl,
  };
}
