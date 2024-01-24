import { useCallback, useMemo } from "react";
import slugify from "slugify";
import { IPage, IPageSettings, IPost } from "@changes-page/supabase/types/page";

export function createPostUrl(pageUrl, post) {
  return `${pageUrl}/post/${post.id}/${slugify(post.title, {
    lower: true,
    strict: true,
  })}`;
}

export function getPageUrl(page, settings) {
  // return "http://localhost:3000";

  if (settings.custom_domain) {
    return `https://${settings.custom_domain}`;
  }

  return `https://${page.url_slug}.changes.page`;
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

  const getPostUrl = useCallback(
    (post: IPost) => createPostUrl(pageUrl, post),
    [pageUrl]
  );

  return {
    pageUrl,
    getPostUrl,
  };
}
