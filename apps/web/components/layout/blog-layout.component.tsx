import { DateTime } from "@changes-page/utils";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { ROUTES } from "../../data/routes.data";
import { BlogPost } from "../../pages/blog";
import { getImageUrl } from "../../utils/cms";
import MarketingHeaderComponent from "../marketing/marketing-header.component";
import StartForFreeFooter from "../marketing/start-for-free-footer";
import FooterComponent from "./footer.component";

export default function BlogLayout({
  title,
  description,
  content,
  featuredImage,
  publishedAt,
  author,
}: BlogPost) {
  return (
    <div className="block h-full bg-gray-100 dark:bg-gray-800">
      <Head>
        <style>
          {`@media only screen and (min-width: 640px) {
          .blog-content-override img {
          display: inline-block;
          margin-top: 80px;
          margin-bottom: 80px;
          transform: scale(1.2);
        }}`}
        </style>
      </Head>
      <MarketingHeaderComponent title={title} description={description} />
      <div className={classNames("mx-auto")}>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 py-16">
          <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[overflow-anchor:none]">
            <div
              className="relative mx-auto h-full max-w-prose text-lg"
              aria-hidden="true"
            >
              <svg
                className="absolute top-12 left-full translate-x-32 transform"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200 dark:text-gray-700"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={384}
                  fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
                />
              </svg>
              <svg
                className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-32 transform"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200 dark:text-gray-700"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={384}
                  fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
                />
              </svg>
              <svg
                className="absolute bottom-12 left-full translate-x-32 transform"
                width={404}
                height={384}
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="d3eb07ae-5182-43e6-857d-35c643af9034"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200 dark:text-gray-700"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={384}
                  fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
                />
              </svg>
            </div>
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-prose text-lg">
              <h1>
                <Link
                  href={ROUTES.BLOG}
                  className="block text-center text-lg font-semibold text-indigo-600 dark:text-indigo-400 uppercase"
                >
                  Blog
                </Link>
                <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl hero">
                  {title}
                </span>
                {publishedAt && author ? (
                  <div className="mt-4 mb-12 flex flex-wrap justify-center items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <time
                      dateTime={publishedAt}
                      className="mr-8"
                      suppressHydrationWarning
                    >
                      {DateTime.fromISO(publishedAt).toNiceFormat()}
                    </time>
                    <div className="-ml-4 flex items-center gap-x-4">
                      <svg
                        viewBox="0 0 2 2"
                        className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <Link href={author.href} className="flex gap-x-2.5">
                        <Image
                          src={getImageUrl(author.avatar)}
                          width={24}
                          height={24}
                          alt={author.fullName ?? "Author"}
                          className="h-6 w-6 flex-none rounded-full bg-white/10"
                        />
                        <span className="text-indigo-500 dark:text-indigo-400 font-semibold underline">
                          {author.fullName}
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </h1>
            </div>

            {featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(featuredImage)}
                alt={"Featured image"}
                className="w-auto max-h-[640px] mx-auto"
              />
            ) : null}

            <div className="blog-content-override prose dark:prose-invert prose-indigo mx-auto mt-6">
              <ReactMarkdown
                rehypePlugins={[
                  rehypeRaw,
                  // @ts-ignore
                  rehypeSanitize({ tagNames: ["div", "iframe"] }),
                  remarkGfm,
                ]}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <StartForFreeFooter />
      </div>

      <FooterComponent />
    </div>
  );
}
