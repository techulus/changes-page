import {
  IPage,
  IPageSettings,
  IPost,
  IReactions,
  PostStatus,
  PostStatusToLabel,
  PostType,
} from "@changespage/supabase/types/page";
import { PostDateTime, PostTypeBadge } from "@changespage/ui";
import { DateTime } from "@changespage/utils";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { createAuditLog } from "../../utils/auditLog";
import usePageUrl from "../../utils/hooks/usePageUrl";
import { httpGet } from "../../utils/http";
import { useUserData } from "../../utils/useUser";
import { notifyError } from "../core/toast.component";
import ConfirmDeleteDialog from "../dialogs/confirm-delete-dialog.component";
import PostOptions from "./post-options";
import { PostStatusIcon } from "./post-status";

const ReactionsCounter = ({ aggregate }: { aggregate: IReactions }) => {
  return (
    <div className={"flex items-center space-x-1 p-1"}>
      {aggregate?.thumbs_up ? (
        <div className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <span>{aggregate?.thumbs_up}</span>
        </div>
      ) : null}

      {aggregate?.thumbs_down ? (
        <div className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
          </svg>
          <span>{aggregate?.thumbs_down}</span>
        </div>
      ) : null}

      {aggregate?.rocket ? (
        <div className="flex items-center space-x-1 text-sm text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          <span>{aggregate?.rocket}</span>
        </div>
      ) : null}

      {aggregate?.sad ? (
        <div className="flex items-center space-x-1 text-sm text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
          <span>{aggregate?.sad}</span>
        </div>
      ) : null}

      {aggregate?.heart ? (
        <div className="flex items-center space-x-1 text-sm text-pink-500 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md">
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>{aggregate?.heart}</span>
        </div>
      ) : null}
    </div>
  );
};

export function Post({
  page,
  post,
  fetchPosts,
  settings,
  updatePageSettings,
}: {
  page: Pick<IPage, "id" | "url_slug">;
  post: IPost;
  fetchPosts: () => void;
  settings: IPageSettings;
  updatePageSettings: (settings: IPageSettings) => void;
}) {
  const { supabase, user } = useUserData();

  const [openDeletePost, setOpenDeletePost] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reactions, setReactions] = useState<IReactions | null>(null);

  const { getPostUrl } = usePageUrl(page, settings);

  const publishedAt = useMemo(() => {
    return post.publication_date ?? post.created_at;
  }, [post]);

  const doDeletePost = useCallback(
    async (post: IPost) => {
      setIsDeleting(true);

      try {
        await supabase.from("posts").delete().eq("id", post.id);

        await createAuditLog(supabase, {
          page_id: page.id,
          actor_id: user.id,
          action: "Deleted Post",
          changes: post,
        });

        fetchPosts();
        setIsDeleting(false);
        setOpenDeletePost(false);
      } catch (e) {
        setIsDeleting(false);
        notifyError();
      }
    },
    [supabase, fetchPosts]
  );

  useEffect(() => {
    if (post.status !== PostStatus.published || !post.allow_reactions) {
      return;
    }

    httpGet({ url: `/api/pages/reactions?post_id=${post.id}` }).then((data) => {
      setReactions(data.aggregate);
    });
  }, []);

  return (
    <>
      <ConfirmDeleteDialog
        open={openDeletePost}
        setOpen={setOpenDeletePost}
        itemName={deletePost?.title || ""}
        processing={isDeleting}
        deleteCallback={() => doDeletePost(deletePost)}
      />
      <li key={post.id} className="relative pl-4 pr-6 py-8">
        <div className="flex items-center justify-between space-x-4 relative">
          <div className="absolute top-3 ml-[-20px] h-[0.0725rem] w-3.5 bg-gray-700 dark:bg-gray-400"></div>
          <div className="min-w-0 w-full space-y-3">
            <span className="inline-flex flex-col md:flex-row text-sm md:space-x-2 space-y-2 md:space-y-0 whitespace-nowrap text-gray-500 dark:text-gray-400">
              <PostDateTime publishedAt={publishedAt} startWithFullDate />

              <div className="flex items-center -mt-0.5 flex-wrap gap-2">
                {(post?.tags ?? []).map((tag: PostType, idx) => (
                  <div key={tag}>
                    <PostTypeBadge type={tag} />
                  </div>
                ))}
                {settings?.pinned_post_id === post.id && (
                  <PostTypeBadge type="pinned" />
                )}
                {post.status !== PostStatus.published && (
                  <div className={classNames(
                    "flex lg:hidden items-center space-x-1.5",
                    post.status === PostStatus.draft && "text-slate-700 dark:text-slate-500",
                    post.status === PostStatus.publish_later && "text-orange-700 dark:text-orange-500"
                  )}>
                    <PostStatusIcon
                      status={post.status}
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {PostStatusToLabel[post.status]}
                      </span>
                      {post.status === PostStatus.publish_later && post.publish_at && (
                        <span className="text-xs">
                          {DateTime.fromISO(post.publish_at).toNiceFormat()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Menu
                as="div"
                className="absolute inline-block text-left lg:hidden ml-auto right-0"
              >
                <div>
                  <Menu.Button className="inline-flex items-center px-2 py-1 -mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Options
                  </Menu.Button>
                </div>

                <PostOptions
                  post={post}
                  postUrl={getPostUrl(post)}
                  settings={settings}
                  page_id={page.id}
                  updatePageSettings={updatePageSettings}
                  setDeletePost={setDeletePost}
                  setOpenDeletePost={setOpenDeletePost}
                />
              </Menu>
            </span>

            <div className="flex items-center">
              <aside className="hidden lg:block absolute top-4 -right-52 w-48">
                <h2 className="sr-only">Options</h2>
                <div className="space-y-5">
                  <div className={classNames(
                    "flex flex-col space-y-1  text-green-700 dark:text-green-500",
                    post.status === PostStatus.draft &&
                    "text-slate-700 dark:text-slate-500",
                    post.status === PostStatus.publish_later &&
                    "text-orange-700 dark:text-orange-500"
                  )}>
                    <span className="text-sm font-medium">
                      <PostStatusIcon
                        status={post.status}
                        className="w-5 h-5 inline-block mr-1.5"
                      />
                      {PostStatusToLabel[post.status]}
                    </span>
                    {post.status === PostStatus.publish_later && post.publish_at && (
                      <span className="text-xs pl-[1.625rem]">
                        {DateTime.fromISO(post.publish_at).toNiceFormat()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Menu
                      as="div"
                      className={"relative inline-block text-left"}
                    >
                      <div>
                        <Menu.Button className="flex items-center space-x-2">
                          <DotsVerticalIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                            Options
                          </span>
                        </Menu.Button>
                      </div>

                      <PostOptions
                        post={post}
                        postUrl={getPostUrl(post)}
                        settings={settings}
                        page_id={page.id}
                        updatePageSettings={updatePageSettings}
                        setDeletePost={setDeletePost}
                        setOpenDeletePost={setOpenDeletePost}
                        floating
                      />
                    </Menu>
                  </div>
                </div>
              </aside>
            </div>

            <span className="block">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                {post.title}
              </h2>
            </span>

            <div className="prose dark:prose-invert text-gray-900 dark:text-gray-300 break-words">
              {/* @ts-ignore */}
              <ReactMarkdown
                rehypePlugins={[
                  rehypeRaw,
                  // @ts-ignore
                  rehypeSanitize({ tagNames: ["div", "iframe"] }),
                  remarkGfm,
                ]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {post.allow_reactions ? (
              <ReactionsCounter aggregate={reactions} />
            ) : null}
          </div>
        </div >
      </li >
    </>
  );
}
