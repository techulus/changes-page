import {
  createChangesPageClient,
  ChangelogPost,
  usePosts,
} from "@changespage/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import ReactMarkdown from "react-markdown";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import { Spinner } from "@changespage/ui";

const POSTS_PER_PAGE = 10;

const client = createChangesPageClient({
  baseUrl: "https://hey.changes.page",
});

export default function Changelog({
  initialPosts,
  initialHasMore,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { posts, hasMore, loading, loadMore } = usePosts({
    client,
    initialData: { posts: initialPosts, hasMore: initialHasMore },
    limit: POSTS_PER_PAGE,
  });

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <HeaderComponent />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Changelog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          New updates and improvements to Changes.page
        </p>

        <div className="space-y-12">
          {posts.map((post) => (
            <ChangelogPost key={post.id} post={post}>
              {({ title, content, tags, formattedDate }) => (
                <article className="border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </time>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 mb-3">
                    {title}
                  </h2>
                  <div className="flex gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-300 capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="prose dark:prose-invert prose-gray max-w-none">
                    {/* @ts-ignore */}
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </article>
              )}
            </ChangelogPost>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : "Load more"}
            </button>
          </div>
        )}
      </div>

      <FooterComponent />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { posts, hasMore } = await client.getPosts({ limit: POSTS_PER_PAGE });

  return {
    props: {
      initialPosts: posts,
      initialHasMore: hasMore,
    },
    revalidate: 86400,
  };
};
