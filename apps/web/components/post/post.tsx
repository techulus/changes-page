import {
  IPage,
  IPageSettings,
  IPost,
  PostStatus,
  PostStatusToLabel,
  PostType,
} from "@changes-page/supabase/types/page";
import { PostDateTime, PostTypeBadge } from "@changes-page/ui";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import usePageUrl from "../../utils/hooks/usePageUrl";
import { useUserData } from "../../utils/useUser";
import { notifyError } from "../core/toast.component";
import ConfirmDeleteDialog from "../dialogs/confirm-delete-dialog.component";
import PostOptions from "./post-options";
import { PostStatusIcon } from "./post-status";

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
  const { supabase } = useUserData();

  const [openDeletePost, setOpenDeletePost] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getPostUrl } = usePageUrl(page, settings);

  const publishedAt = useMemo(() => {
    return post.publication_date ?? post.created_at;
  }, [post]);

  const doDeletePost = useCallback(
    async (post: IPost) => {
      setIsDeleting(true);

      try {
        await supabase.from("posts").delete().eq("id", post.id);

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
            <span className="inline-flex text-sm space-x-2 whitespace-nowrap text-gray-500 dark:text-gray-400">
              <PostDateTime publishedAt={publishedAt} startWithFullDate />

              <div className="flex items-center -mt-0.5">
                {(post?.tags ?? []).map((tag: PostType) => (
                  <div key={tag} className="ml-2">
                    <PostTypeBadge type={tag} />
                  </div>
                ))}
                {settings?.pinned_post_id === post.id && (
                  <PostTypeBadge type="pinned" className="ml-2" />
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
                  <div className="flex items-center space-x-2">
                    <span
                      className={classNames(
                        "text-sm font-medium text-green-700 dark:text-green-500",
                        post.status === PostStatus.draft &&
                          "text-slate-700 dark:text-slate-500",
                        post.status === PostStatus.publish_later &&
                          "text-orange-700 dark:text-orange-500"
                      )}
                    >
                      <PostStatusIcon
                        status={post.status}
                        className="w-5 h-5 inline-block mr-1.5"
                      />
                      {PostStatusToLabel[post.status]}
                    </span>
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
              <ReactMarkdown
                rehypePlugins={[
                  rehypeRaw,
                  // @ts-ignore
                  rehypeSanitize({ tagNames: ["div", "iframe"] }),
                ]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}
