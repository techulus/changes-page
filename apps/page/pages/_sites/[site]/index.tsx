import { IPage, IPageSettings, IPost } from "@changes-page/supabase/types/page";
import { Timeline } from "@changes-page/ui";
import classNames from "classnames";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../../../components/footer";
import PageHeader from "../../../components/page-header";
import Post from "../../../components/post";
import SeoTags from "../../../components/seo-tags";
import SubscribePrompt from "../../../components/subscribe-prompt";
import {
  BLACKLISTED_SLUGS,
  fetchPosts,
  fetchRenderData,
  isSubscriptionActive,
} from "../../../lib/data";
import FourOhFour from "../../404";

export default function Index({
  notFound,
  posts: initialPosts,
  page,
  postsCount,
  settings,
}: {
  notFound: boolean;
  page: IPage;
  settings: IPageSettings;
  posts: IPost[];
  postsCount: number;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings?.color_scheme != "auto") {
      setTheme(settings?.color_scheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.color_scheme]);

  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const allowLoadMore = useMemo(
    () => posts.length < postsCount,
    [posts, postsCount]
  );

  const loadMorePosts = useCallback(
    async (offset = 0) => {
      setLoadingMore(true);

      try {
        const response = await fetch(
          `/api/posts?page_id=${page?.id}&offset=${offset}`
        );

        if (response.ok) {
          const data = await response.json();
          setPosts((posts) => [...posts, ...data]);
        }

        setLoadingMore(false);
      } catch (e) {
        console.error(e);
        setLoadingMore(false);
      }
    },
    [page]
  );

  if (notFound || !page || !settings) {
    return <FourOhFour />;
  }

  return (
    <>
      <SeoTags page={page} settings={settings} posts={posts} />

      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <PageHeader page={page} settings={settings} />

        {(settings?.email_notifications || settings?.rss_notifications) && (
          <SubscribePrompt page={page} settings={settings} />
        )}

        <main>
          <div className="relative max-w-2xl mx-auto">
            <Timeline />
            <div className="sm:rounded-md">
              {posts.length === 0 && (
                <div className="text-center p-16">
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                    👋 Hey there! Looks like there aren&apos;t any posts here
                    yet.
                  </h3>
                </div>
              )}

              {posts.length > 0 && (
                <ul className="relative z-0 dark:text-white">
                  {posts.map((post) => (
                    <li key={post.id} className="relative pl-4 pr-6 py-8">
                      <Post
                        post={post}
                        isPinned={settings?.pinned_post_id == post.id}
                      />
                    </li>
                  ))}

                  {loadingMore &&
                    [1, 2].map((k) => (
                      <li key={k} className="relative ">
                        <div className="block pl-4 pr-6 py-5 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6">
                          <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-6 py-1">
                              <div className="grid grid-cols-6 gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-500 col-span-2 rounded"></div>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded col-span-2"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {!loadingMore && allowLoadMore && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className={classNames(
                    "my-6 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                    "text-indigo-700 bg-indigo-100 hover:bg-indigo-200",
                    "dark:bg-indigo-700 dark:text-indigo-100 dark:hover:bg-indigo-800"
                  )}
                  onClick={() => loadMorePosts(posts?.length)}
                >
                  View more <span className="lowercase ml-1">{page?.type}</span>
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer settings={settings} />
      </div>
    </>
  );
}

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

export async function getServerSideProps({
  params: { site },
}: {
  params: { site: string };
}) {
  console.log("handle site ->", site);

  if (!site) {
    throw new Error("URL slug or domain is missing");
  }

  if (BLACKLISTED_SLUGS.includes(site)) {
    return {
      notFound: true,
    };
  }

  console.time("fetchRenderData");
  const { page, settings } = await fetchRenderData(site);
  console.timeEnd("fetchRenderData");

  if (!page || !settings || !(await isSubscriptionActive(page?.user_id))) {
    return {
      props: {
        page,
        settings,
        posts: [],
        // Returning notFound doesn't work with ISR, hence the hack
        notFound: true,
      },
    };
  }

  console.time("fetchPosts");
  const { posts, postsCount } = await fetchPosts(String(page?.id), {
    pinned_post_id: settings?.pinned_post_id,
    limit: 10,
  });
  console.timeEnd("fetchPosts");

  return {
    props: {
      page,
      posts,
      postsCount,
      settings,
    },
  };
}
