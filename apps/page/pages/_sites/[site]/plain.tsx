import {
  IPage,
  IPageSettings,
  IPost,
  PostType,
  PostTypeToLabel,
} from "@changespage/supabase/types/page";
import { DateTime } from "@changespage/utils";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import SeoTags from "../../../components/seo-tags";
import {
  fetchPosts,
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../../lib/data";
import { getPageUrl } from "../../../lib/url";

export default function Index({
  posts,
  page,
  settings,
}: {
  posts: IPost[];
  page: IPage;
  postsCount: number;
  settings: IPageSettings;
}) {
  const router = useRouter();
  const { hideTitle } = router.query;

  useEffect(() => {
    if (!page) {
      void router.replace("/404");
    }
  }, [page, router]);

  if (!page) return false;

  return (
    <>
      <SeoTags
        page={page}
        settings={settings}
        url={`${getPageUrl(page, settings)}/plain`}
      />

      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 min-h-full">
        {hideTitle !== "true" && (
          <h2 className="page-title text-3xl font-extrabold tracking-tight sm:text-4xl">
            {page?.title}
          </h2>
        )}

        <main>
          <div>
            {posts.length === 0 && (
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                No posts found
              </h3>
            )}

            {posts.map((post) => (
              <div key={post.id} className="py-4">
                <h2 className="post-title text-xl font-bold">{post.title}</h2>

                <div className="min-w-0 w-full">
                  {(post.tags ?? [])
                    .map((tag) => PostTypeToLabel[tag as PostType])
                    .join(", ")}
                  {" | "}
                  <span className="inline-flex text-sm space-x-2 whitespace-nowrap">
                    <time dateTime="2020-09-20" suppressHydrationWarning>
                      {DateTime.fromISO(
                        post.publication_date ?? post.created_at
                      ).toRelative()}
                    </time>
                  </span>
                </div>

                <div className="prose dark:prose-invert text-gray-900 dark:text-gray-300 mt-1">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const hostname = context?.req?.headers?.host;
  const { limit } = context?.query;
  const { domain, page: url_slug } = translateHostToPageIdentifier(
    hostname ?? ""
  );
  const site = url_slug || domain;

  console.log("handle site ->", site);

  if (!site) {
    throw new Error("URL slug or domain is missing");
  }

  const { page, settings } = await fetchRenderData(site);
  const { posts, postsCount } = await fetchPosts(String(page?.id), {
    limit: Number(limit ?? 25),
    pinned_post_id: settings?.pinned_post_id,
  });

  return {
    props: {
      page,
      posts,
      postsCount,
      settings,
    },
  };
}
