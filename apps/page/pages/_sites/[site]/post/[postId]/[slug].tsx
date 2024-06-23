import { Timeline } from "@changes-page/ui";
import { convertMarkdownToPlainText } from "@changes-page/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import { InferGetServerSidePropsType } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect } from "react";
import { validate as uuidValidate } from "uuid";
import Footer from "../../../../../components/footer";
import PageHeader from "../../../../../components/page-header";
import Post from "../../../../../components/post";
import SeoTags from "../../../../../components/seo-tags";
import SubscribePrompt from "../../../../../components/subscribe-prompt";
import {
  fetchPostById,
  fetchRenderData,
  isSubscriptionActive,
} from "../../../../../lib/data";
import { getPageUrl, getPostUrl } from "../../../../../lib/url";

export default function Index({
  post,
  page,
  nextPost,
  settings,
  plainTextContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings?.color_scheme != "auto") {
      setTheme(settings?.color_scheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.color_scheme]);

  return (
    <>
      <SeoTags
        page={page}
        settings={settings}
        posts={[post]}
        content={plainTextContent}
        url={getPostUrl(getPageUrl(page, settings), post)}
      />

      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <PageHeader page={page} settings={settings} />

        <main>
          <div className="relative max-w-2xl mx-auto">
            <Timeline />
            <div className="sm:rounded-md">
              <ul className="relative z-0 dark:text-white">
                <li key={post.id} className="relative pl-4 pr-6 py-8">
                  <Post
                    post={post}
                    isPinned={settings?.pinned_post_id == post.id}
                  />
                </li>
              </ul>
            </div>

            <div className="-mt-px flex flex-col md:flex-row w-auto flex-1 ml-2 justify-between">
              <Link
                href="/"
                className="inline-flex items-center pt-4 pr-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
              >
                <ArrowLeftIcon
                  className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
                Back to all
              </Link>

              {nextPost ? (
                <Link
                  href={getPostUrl(getPageUrl(page, settings), nextPost)}
                  className="inline-flex items-center pt-4 pr-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 ml-auto md:ml-0"
                >
                  {nextPost.title}
                  <ArrowRightIcon
                    className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-600"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </main>

        {(settings?.email_notifications || settings?.rss_notifications) && (
          <div className="mt-16">
            <SubscribePrompt page={page} settings={settings} />
          </div>
        )}

        <Footer settings={settings} />
      </div>
    </>
  );
}

export async function getServerSideProps({
  params: { site, postId },
}: {
  params: { site: string; postId: string };
}) {
  console.log("handle site ->", site);
  console.log("handle post id ->", postId);

  if (!site) {
    throw new Error("URL slug or domain is missing");
  }

  if (!uuidValidate(postId)) {
    return {
      notFound: true,
    };
  }

  const { page, settings } = await fetchRenderData(site);

  if (!page || !settings || !(await isSubscriptionActive(page?.user_id))) {
    return {
      notFound: true,
    };
  }

  const { post, nextPost } = await fetchPostById(postId, String(page.id));

  if (!post || !page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      post,
      nextPost,
      settings,
      plainTextContent: convertMarkdownToPlainText(post.content),
    },
  };
}
