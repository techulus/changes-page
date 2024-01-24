import { IPage, IPageSettings, IPost } from "../data/page.interface";
import { Database } from "@changes-page/supabase/types";
import { supabaseAdmin } from "@changes-page/supabase/admin";

const PAGINATION_LIMIT = 50;

export const BLACKLISTED_SLUGS = [
  "www",
  "app",
  "support",
  "help",
  "account",
  "create",
  "new",
  "login",
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

function translateHostToPageIdentifier(host: string): {
  page: string | null;
  domain: string | null;
} {
  let isDev = host.includes("localhost") || host.includes("user-changes-page");
  let splitHost = host.split(".");

  if (isDev) {
    // return { domain: "local.techulus.xyz", page: null };
    return { page: "local", domain: null };
  }

  // custom domain check
  if (!host.includes(".changes.page")) {
    return { domain: host, page: null };
  }

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    let page = splitHost[0];

    return { page, domain: null };
  }

  return {
    page: null,
    domain: null,
  };
}

async function fetchRenderData(
  site: string
): Promise<{ page: IPage | null; settings: IPageSettings | null }> {
  const pageSelect = `id,title,description,type,url_slug,user_id`;
  const settingsSelect = `page_id,page_logo,cover_image,product_url,twitter_url,github_url,instagram_url,facebook_url,linkedin_url,youtube_url,tiktok_url,app_store_url,play_store_url,pinned_post_id,whitelabel,hide_search_engine,email_notifications,rss_notifications,color_scheme`;

  let page = null,
    settings = null;

  const emptyResponse = {
    page: null,
    settings: null,
  };

  try {
    if (site.includes(".")) {
      const { data: settingsForDomain, error: settingsForDomainError } =
        await supabaseAdmin
          .from("page_settings")
          .select(`${settingsSelect}`)
          .eq("custom_domain", String(site))
          .maybeSingle();

      if (settingsForDomainError || !settingsForDomain) {
        console.error(
          "[fetchRenderData] Fetch settings for domain error",
          settingsForDomainError
        );
        return emptyResponse;
      }

      settings = settingsForDomain;

      const { data: pageForDomain, error: pageForDomainError } =
        await supabaseAdmin
          .from("pages")
          .select(`${pageSelect}`)
          .eq("id", settings?.page_id)
          .maybeSingle();

      if (pageForDomainError || !pageForDomain) {
        console.error(
          "[fetchRenderData] Fetch page for domain error",
          pageForDomainError
        );
        return emptyResponse;
      }

      page = pageForDomain;
    } else {
      const { data: pageForSlug, error: pageError } = await supabaseAdmin
        .from("pages")
        .select(`${pageSelect}`)
        .eq("url_slug", String(site))
        .maybeSingle();

      if (pageError || !pageForSlug) {
        console.error("[fetchRenderData] Fetch page error", pageError);
        return emptyResponse;
      }

      page = pageForSlug;

      const { data: settingsForPage, error: settingsForPageError } =
        await supabaseAdmin
          .from("page_settings")
          .select(`${settingsSelect}`)
          .eq("page_id", page?.id ?? "")
          .maybeSingle();

      if (settingsForPageError || !settingsForPage) {
        console.error(
          "[fetchRenderData] Fetch settings for page error",
          settingsForPageError
        );
        return emptyResponse;
      }

      settings = settingsForPage;
    }

    return {
      page: page as IPage,
      settings: settings as IPageSettings,
    };
  } catch (e) {
    console.log("[fetchRenderData] error", e);

    return {
      page: null,
      settings: null,
    };
  }
}

async function fetchPosts(
  pageId: string,
  { limit, pinned_post_id }: { limit?: number; pinned_post_id?: string | null }
): Promise<{ posts: IPost[]; postsCount: number }> {
  const postsQuery = supabaseAdmin
    .from("posts")
    .select(
      "id,title,content,type,publication_date,updated_at,created_at,allow_reactions",
      {
        count: "exact",
      }
    )
    .eq("page_id", String(pageId))
    .eq("status", "published")
    .range(
      0,
      limit
        ? Math.min(Number(limit) - 1, PAGINATION_LIMIT)
        : PAGINATION_LIMIT - 1
    )
    .order("created_at", { ascending: false });

  if (pinned_post_id) {
    postsQuery.neq("id", pinned_post_id);

    const {
      data: posts,
      count: postsCount,
      error: postsError,
    } = await postsQuery;

    if (postsError) {
      console.error("Fetch post error", postsError);
      throw new Error("Failed to fetch posts");
    }

    // Get pinned post
    const { data: pinnedPost, error: pinnedPostError } = await supabaseAdmin
      .from("posts")
      .select(
        "id,title,content,type,publication_date,updated_at,created_at,allow_reactions"
      )
      .eq("id", pinned_post_id)
      .eq("status", "published")
      .maybeSingle();

    if (pinnedPostError) {
      console.error(
        "[fetchRenderData] Fetch pinned post error",
        pinnedPostError
      );
    }

    return {
      posts: (pinnedPost
        ? [pinnedPost, ...(posts ?? [])]
        : posts ?? []) as Array<IPost>,
      postsCount: postsCount ?? 0,
    };
  }

  const {
    data: posts,
    count: postsCount,
    error: postsError,
  } = await postsQuery;

  if (postsError) {
    console.error("Fetch post error", postsError);
    throw new Error("Failed to fetch posts");
  }

  return { posts: (posts ?? []) as Array<IPost>, postsCount: postsCount ?? 0 };
}

async function fetchPostById(postId: string, pageId: string) {
  const { data: post, error: postError } = await supabaseAdmin
    .from("posts")
    .select(
      "id,title,content,type,publication_date,updated_at,created_at,allow_reactions"
    )
    .eq("id", String(postId))
    .eq("page_id", String(pageId))
    .eq("status", "published")
    .maybeSingle();

  if (postError) {
    console.error(postError);
    throw new Error("Failed to fetch post");
  }

  return post;
}

async function isSubscriptionActive(user_id: string): Promise<boolean> {
  const { data: isSubscriptionActive, error } = await supabaseAdmin
    .rpc<
      "is_subscription_active",
      Database["public"]["Functions"]["is_subscription_active"]
    >("is_subscription_active", {
      user_id,
    })
    .maybeSingle();

  if (error) {
    console.log("is_subscription_active check failed, error ->", error);
    return true;
  }

  console.log(
    "[is_subscription_active] check success, isSubscriptionActive ->",
    isSubscriptionActive
  );

  return isSubscriptionActive ?? true;
}

export {
  PAGINATION_LIMIT,
  fetchPostById,
  fetchPosts,
  fetchRenderData,
  isSubscriptionActive,
  translateHostToPageIdentifier,
};
