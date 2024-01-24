import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import slugify from "slugify";
import { IPost } from "@changes-page/supabase/types/page";
import { DateTime } from "../utils/date";
import Reactions from "./reactions";
import { PostTypeToBadge } from "@changes-page/ui";

export default function Post({
  post,
  isPinned = false,
  className = "",
}: {
  post: IPost;
  isPinned: boolean;
  className?: string;
}) {
  const postUrl = useMemo(() => {
    return `/post/${post.id}/${slugify(post.title, {
      lower: true,
      strict: true,
    })}`;
  }, [post]);

  const publishedAt = useMemo(() => {
    return post.publication_date ?? post.created_at;
  }, [post]);

  return (
    <div
      className={classNames(
        "flex items-center justify-between space-x-4 relative",
        className
      )}
    >
      <div className="absolute top-3 ml-[-20px] h-[0.0725rem] w-3.5 bg-gray-700 dark:bg-gray-400"></div>
      <div className="min-w-0 w-full space-y-3">
        <span className="inline-flex text-sm space-x-2 whitespace-nowrap text-gray-500 dark:text-gray-400">
          <time dateTime={publishedAt} suppressHydrationWarning>
            {DateTime.fromISO(publishedAt).toRelative()}
          </time>

          <div className="flex items-center -mt-0.5">
            {post?.type && PostTypeToBadge[post?.type]({})}
            {isPinned && <PostTypeToBadge.Pinned className="ml-2" />}
          </div>
        </span>

        <div className="min-w-0 w-full">
          <span className="block">
            <Link href={postUrl}>
              <h2 className="text-xl font-bold">{post.title}</h2>
            </Link>
          </span>
        </div>

        <div className="prose dark:prose-invert text-gray-900 dark:text-gray-300 break-words">
          <ReactMarkdown
            rehypePlugins={[
              rehypeRaw,
              // @ts-ignore
              rehypeSanitize({ tagNames: ["div", "iframe"] }),
            ]}
            components={{
              img: (props) => {
                if (props.src?.includes("supabase.co")) {
                  return (
                    <Image
                      src={props.src ?? ""}
                      alt={props.alt ?? post.title}
                      width={624}
                      height={624}
                    />
                  );
                } else {
                  return <img {...props} alt={post.title} />;
                }
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post?.allow_reactions ? <Reactions post={post} /> : null}
      </div>
    </div>
  );
}
