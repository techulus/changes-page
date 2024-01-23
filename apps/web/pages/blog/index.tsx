import { BookOpenIcon } from "@heroicons/react/solid";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import classNames from "classnames";
import groq from "groq";
import Image from "next/image";
import Link from "next/link";
import FooterComponent from "../../components/layout/footer.component";
import MarketingHeaderComponent from "../../components/marketing/marketing-header.component";
import StartForFreeFooter from "../../components/marketing/start-for-free-footer";
import { TAGLINE } from "../../data/marketing.data";
import cms, { getImageUrl } from "../../utils/cms";
import { DateTime } from "../../utils/date";

export type BlogPost = {
  _id: string;
  title: string;
  description: string;
  content: string;
  featuredImage: SanityImageSource;
  url: {
    current: string;
  };
  publishedAt: string;
  tags: string[];
  author: {
    fullName: string;
    avatar: SanityImageSource;
    href: string;
  };
};

export async function getStaticProps() {
  const posts: BlogPost[] = await cms.fetch(groq`
      *[_type == "post" && publishedAt < now()]{
        _id, title, url, tags, description, publishedAt,
        author->{fullName, avatar, href},
      } | order(publishedAt desc)
    `);

  return { props: { posts } };
}

export default function Blog({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="block h-full bg-gray-100 dark:bg-gray-800">
      <MarketingHeaderComponent
        title="Blog | changes.page"
        description={posts[0].title}
      />
      <div className="bg-white dark:bg-gray-800 px-6 pt-16 pb-20 lg:px-8 lg:pt-16 lg:pb-28">
        <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 dark:divide-gray-600 lg:max-w-6xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white dark:text-gray-200 sm:text-4xl hero">
              <BookOpenIcon className="h-12 w-12 inline mr-2" />
              Recent publications
            </h2>
            <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
              {TAGLINE}
            </p>
          </div>
          <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
            {posts.map((post) => (
              <div key={post._id}>
                <div>
                  {post.tags.map((tag, i) => (
                    <div key={tag} className="inline-block">
                      <span
                        className={classNames(
                          "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 capitalize",
                          i > 0 ? "ml-2" : ""
                        )}
                      >
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href={`/blog/${post.url.current}`} className="mt-4 block">
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                    {post.title}
                  </p>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                    {post.description}
                  </p>
                </Link>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div>
                      <span className="sr-only">{post.author.fullName}</span>
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={getImageUrl(post.author.avatar)}
                        width={40}
                        height={40}
                        alt={post.author.fullName ?? "Author"}
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Link
                        className="text-indigo-500 dark:text-indigo-400 font-semibold underline"
                        href={post.author.href}
                      >
                        {post.author.fullName}
                      </Link>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.publishedAt}>
                        {DateTime.fromJSDate(
                          new Date(post.publishedAt)
                        ).toRelative()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StartForFreeFooter />
      <FooterComponent />
    </div>
  );
}
