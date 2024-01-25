import { Menu } from "@headlessui/react";
import { ClockIcon } from "@heroicons/react/outline";
import {
  ChartBarIcon,
  CheckIcon,
  CodeIcon,
  CogIcon,
  DocumentTextIcon,
  DotsVerticalIcon,
  ExternalLinkIcon,
  HomeIcon,
  PencilAltIcon,
  PencilIcon,
  PlusIcon,
  RssIcon,
  SearchIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Script from "next/script";
import { useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import {
  PrimaryRouterButton,
  SecondaryButton,
  SecondaryRouterButton,
  SidebarButton,
} from "../../../components/core/buttons.component";
import { MenuItem } from "../../../components/core/menu.component";
import { notifyError } from "../../../components/core/toast.component";
import ConfirmDeleteDialog from "../../../components/dialogs/confirm-delete-dialog.component";
import WidgetCodeDialog from "../../../components/dialogs/widget-code-dialog";
import {
  LoadingButtons,
  LoadingShimmer,
  NewPageOnboarding,
} from "../../../components/entity/empty-state";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import PostOptions from "../../../components/post/post-options";
import { PostTypeToBadge } from "@changes-page/ui";
import {
  IPost,
  PostStatus,
  PostStatusToLabel,
} from "@changes-page/supabase/types/page";
import { ROUTES } from "../../../data/routes.data";
import { DateTime } from "../../../utils/date";
import usePageSettings from "../../../utils/hooks/usePageSettings";
import usePageUrl from "../../../utils/hooks/usePageUrl";
import usePosts from "../../../utils/hooks/usePosts";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../utils/useDatabase";
import { getPage } from "../../../utils/useSSR";
import { useUserData } from "../../../utils/useUser";

const PostStatusToIcon = {
  [PostStatus.draft]: PencilIcon,
  [PostStatus.publish_later]: ClockIcon,
  [PostStatus.published]: CheckIcon,
};

export async function getServerSideProps({ req, res, params }) {
  const { page_id } = params;

  const { user, supabase } = await getSupabaseServerClient({ req, res });
  const page = await getPage(supabase, page_id);

  if (!page) {
    return {
      notFound: true,
    };
  }

  const settings = await createOrRetrievePageSettings(user.id, String(page_id));

  return {
    props: {
      page_id,
      page,
      settings,
    },
  };
}

export default function PageDetail({
  page,
  page_id,
  settings: serverSettings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { supabase } = useUserData();
  const { status } = router.query;

  const [search, setSearch] = useState("");

  const { settings: clientSettings, updatePageSettings } = usePageSettings(
    page_id,
    false
  );

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  const { pageUrl, getPostUrl } = usePageUrl(page, settings);
  const {
    loading: loadingPosts,
    posts,
    pinnedPost,
    allowLoadMore,
    loadingMore,
    fetchPosts,
    search_value,
  } = usePosts(page_id, search, settings?.pinned_post_id);

  const loading = useMemo(
    () => loadingPosts || !settings || !page,
    [loadingPosts, settings, page]
  );

  const [openDeletePage, setOpenDeletePage] = useState(false);
  const [openDeletePost, setOpenDeletePost] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showWidgetCode, setShowWidgetCode] = useState(false);

  const statusFilters = useMemo(
    () => [
      {
        name: "All",
        href: { query: { page_id } },
        icon: HomeIcon,
        current: !status,
        keyboardShortcut: "A",
      },
      {
        name: "Published",
        href: { query: { status: PostStatus.published, page_id } },
        icon: PostStatusToIcon[PostStatus.published],
        current: status === PostStatus.published,
        keyboardShortcut: "P",
      },
      {
        name: "Scheduled",
        href: { query: { status: PostStatus.publish_later, page_id } },
        icon: PostStatusToIcon[PostStatus.publish_later],
        current: status === PostStatus.publish_later,
        keyboardShortcut: "S",
      },
      {
        name: "Drafts",
        href: { query: { status: PostStatus.draft, page_id } },
        icon: PostStatusToIcon[PostStatus.draft],
        current: status === PostStatus.draft,
        keyboardShortcut: "D",
      },
    ],
    [status, page_id]
  );

  // New post hotkey
  useHotkeys(
    "N",
    () => {
      void router.push(`/pages/${page_id}/new`);
    },
    [page_id]
  );

  // status filter hotkeys
  useHotkeys("A", () => router.push({ query: { page_id } }), [router, page_id]);
  useHotkeys(
    "P",
    () => router.push({ query: { status: PostStatus.published, page_id } }),
    [router, page_id]
  );
  useHotkeys(
    "S",
    () => router.push({ query: { status: PostStatus.publish_later, page_id } }),
    [router, page_id]
  );
  useHotkeys(
    "D",
    () => router.push({ query: { status: PostStatus.draft, page_id } }),
    [router, page_id]
  );

  const managePageLinks = useMemo(
    () =>
      pageUrl
        ? [
            {
              label: "Analytics",
              href: `${ROUTES.PAGES}/${page_id}/analytics`,
              icon: (props) => <ChartBarIcon {...props} />,
            },
            {
              label: "Settings",
              href: `${ROUTES.PAGES}/${page_id}/settings/general`,
              icon: (props) => <CogIcon {...props} />,
            },
            {
              label: "Edit Page",
              href: `${ROUTES.PAGES}/${page_id}/edit`,
              icon: (props) => <PencilAltIcon {...props} />,
            },
          ]
        : [],
    [pageUrl, page_id]
  );

  const pageLinks = useMemo(
    () =>
      pageUrl
        ? [
            {
              label: "View Page",
              href: pageUrl,
              icon: (props: any) => <ExternalLinkIcon {...props} />,
            },

            {
              label: "View as Markdown",
              href: `${pageUrl}/changes.md`,
              icon: (props: any) => <DocumentTextIcon {...props} />,
            },
            {
              label: "View as JSON",
              href: `${pageUrl}/changes.json`,
              icon: (props: any) => <CodeIcon {...props} />,
            },
            {
              label: "View as RSS feed",
              href: `${pageUrl}/rss.xml`,
              icon: (props: any) => <RssIcon {...props} />,
            },
            {
              label: "View as Atom feed",
              href: `${pageUrl}/atom.xml`,
              icon: (props: any) => <RssIcon {...props} />,
            },
          ]
        : [],
    [pageUrl]
  );

  async function doDeletePost(post: IPost) {
    setIsDeleting(true);

    try {
      await supabase.from("posts").delete().eq("id", post.id);

      await fetchPosts();
      setIsDeleting(false);
      setOpenDeletePost(false);
    } catch (e) {
      setIsDeleting(false);
      notifyError();
    }
  }

  async function doDeletePage() {
    setIsDeleting(true);

    try {
      await supabase.from("pages").delete().eq("id", page.id);

      void router.push(ROUTES.PAGES);
    } catch (e) {
      setIsDeleting(false);
    }
  }

  if (!page_id) return null;

  return (
    <>
      {/* Start widget */}
      {pageUrl && (
        <Script src={`${pageUrl}/v1/widget.js`} strategy="lazyOnload" async />
      )}
      <WidgetCodeDialog
        urlSlug={page?.url_slug}
        open={showWidgetCode}
        setOpen={setShowWidgetCode}
      />
      {/* End widget */}

      <ConfirmDeleteDialog
        open={openDeletePost}
        setOpen={setOpenDeletePost}
        itemName={deletePost?.title || ""}
        processing={isDeleting}
        deleteCallback={() => doDeletePost(deletePost)}
      />

      <ConfirmDeleteDialog
        highRiskAction
        riskVerificationText="delete page"
        open={openDeletePage}
        setOpen={setOpenDeletePage}
        itemName={page?.title}
        processing={isDeleting}
        deleteCallback={() => doDeletePage()}
      />

      <Page
        title={page?.title}
        subtitle="Posts"
        showBackButton={true}
        backRoute={ROUTES.PAGES}
        buttons={
          <PrimaryRouterButton
            label="New"
            icon={
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            }
            route={`/pages/${page_id}/new`}
            keyboardShortcut={"N"}
          />
        }
        menuItems={
          <>
            {page?.url_slug && (
              <div className="py-1">
                {pageLinks.map((link) => (
                  <MenuItem
                    key={link.href}
                    label={link.label}
                    icon={
                      <link.icon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    }
                    route={link.href}
                    external={true}
                  />
                ))}
              </div>
            )}

            <div className="py-1">
              {managePageLinks.map((link) => (
                <MenuItem
                  key={link.href}
                  label={link.label}
                  icon={
                    <link.icon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  }
                  route={link.href}
                />
              ))}
            </div>
            <div className="py-1">
              <MenuItem
                label="Delete Page"
                icon={
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                    aria-hidden="true"
                  />
                }
                onClick={() => setOpenDeletePage(true)}
              />
            </div>
          </>
        }
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 -mt-6">
          <aside className="hidden sticky top-20 self-start lg:block py-2 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <div className="mt-4 pb-4">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <SearchIcon
                    className="mr-3 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-300"
                  placeholder="Search"
                  value={search}
                  onChange={(evt) => setSearch(evt?.target?.value)}
                />

                {!!search && (
                  <div
                    className="absolute inset-y-0 right-0 flex items-center cursor-pointer"
                    onClick={() => setSearch("")}
                    aria-hidden="true"
                  >
                    <XCircleIcon
                      className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pb-4 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Filter
              </h3>
              {loading ? (
                <LoadingButtons count={3} />
              ) : (
                statusFilters.map((item) => (
                  <SidebarButton
                    key={item.name}
                    Icon={item.icon}
                    label={item.name}
                    href={item.href}
                    current={item.current}
                    keyboardShortcut={item.keyboardShortcut}
                  />
                ))
              )}
            </div>

            <div className="pb-8 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Manage
              </h3>
              {!managePageLinks.length && <LoadingButtons count={3} />}

              {managePageLinks.map((link) => (
                <SidebarButton
                  key={link.label}
                  label={link.label}
                  Icon={link.icon}
                  href={link.href}
                />
              ))}
            </div>

            <div className="pb-8 space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Widget
              </h3>

              {pageUrl ? (
                <>
                  <SidebarButton
                    label="Get widget code"
                    onClick={() => setShowWidgetCode(true)}
                    Icon={CodeIcon}
                  />

                  <SidebarButton
                    label="See Widget demo"
                    onClick={() => {
                      // @ts-ignore
                      window?.ChangesPage?.openWidget();
                    }}
                    Icon={ExternalLinkIcon}
                  />
                </>
              ) : (
                <LoadingButtons count={2} />
              )}
            </div>
          </aside>

          <div
            className={classNames(
              "pb-20 space-y-6 lg:px-0 lg:mr-8 lg:col-span-7",
              !loading && posts.length === 0
                ? "lg:col-span-9 lg:mr-0"
                : "lg:col-span-7 lg:mr-8"
            )}
          >
            <div className="bg-white dark:bg-gray-900 shadow">
              <ul className="relative z-0 divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
                {loading &&
                  [...Array(4)].map((_, idx) => <LoadingShimmer key={idx} />)}

                {!loading &&
                  !posts.length &&
                  !status &&
                  !search_value &&
                  !pinnedPost && (
                    <NewPageOnboarding page_id={page?.id} settings={settings} />
                  )}

                {!loading &&
                  !posts.length &&
                  (status || search_value) &&
                  !pinnedPost && (
                    <div className="text-center h-36 flex flex-col items-center justify-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        No posts found!
                      </h3>
                    </div>
                  )}

                {!loading &&
                  (pinnedPost ? [pinnedPost, ...posts] : posts).map((post) => (
                    <li
                      key={post.id}
                      className="relative pl-4 pr-6 py-5 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
                    >
                      <div className="flex items-center justify-between space-x-4">
                        <div className="min-w-0 w-full space-y-3">
                          <div className="flex items-center">
                            {PostTypeToBadge[post.type]({})}

                            {settings?.pinned_post_id === post.id && (
                              <PostTypeToBadge.Pinned className="ml-2" />
                            )}

                            {post.status === PostStatus.published && (
                              <SecondaryRouterButton
                                icon={
                                  <ExternalLinkIcon
                                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                }
                                className="relative inline-block ml-auto lg:hidden"
                                label="View"
                                route={getPostUrl(post)}
                                external
                                hideLabel
                              />
                            )}

                            <Menu
                              as="div"
                              className={classNames(
                                "relative inline-block text-left lg:hidden",
                                post.status === PostStatus.published
                                  ? "ml-2"
                                  : "ml-auto"
                              )}
                            >
                              <div>
                                <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                  <DotsVerticalIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </Menu.Button>
                              </div>

                              <PostOptions
                                post={post}
                                settings={settings}
                                page_id={page_id}
                                updatePageSettings={updatePageSettings}
                                setDeletePost={setDeletePost}
                                setOpenDeletePost={setOpenDeletePost}
                              />
                            </Menu>

                            <aside className="hidden lg:block absolute top-4 -right-52 w-48">
                              <h2 className="sr-only">Options</h2>
                              <div className="space-y-5">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={classNames(
                                      "text-sm font-medium text-green-700 dark:text-green-500",
                                      post.status === PostStatus.draft &&
                                        "text-slate-700 dark:text-slate-500",
                                      post.status ===
                                        PostStatus.publish_later &&
                                        "text-orange-700 dark:text-orange-500"
                                    )}
                                  >
                                    {PostStatusToLabel[post.status]}
                                  </span>
                                </div>

                                {post.status === PostStatus.published ? (
                                  <a
                                    href={getPostUrl(post)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2"
                                  >
                                    <ExternalLinkIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                      View Post
                                    </span>
                                  </a>
                                ) : null}

                                <div className="flex items-center space-x-2">
                                  <Menu
                                    as="div"
                                    className={
                                      "relative inline-block text-left"
                                    }
                                  >
                                    <div>
                                      <Menu.Button className="flex items-center space-x-2">
                                        <DotsVerticalIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                                          More
                                        </span>
                                      </Menu.Button>
                                    </div>

                                    <PostOptions
                                      post={post}
                                      settings={settings}
                                      page_id={page_id}
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

                            <span className="inline-flex text-sm space-x-2 whitespace-nowrap text-gray-500 dark:text-gray-400">
                              <time
                                dateTime={
                                  post.publication_date ?? post.created_at
                                }
                                suppressHydrationWarning
                              >
                                {DateTime.fromISO(
                                  post.publication_date ?? post.created_at
                                ).toNiceFormat()}
                              </time>
                            </span>
                          </span>

                          <div className="prose dark:prose-invert break-words">
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
                  ))}
                {loadingMore && <LoadingShimmer />}
              </ul>
            </div>

            {!loading && posts?.length > 0 && page?.type && allowLoadMore && (
              <SecondaryButton
                className="my-3 ml-3 sm:ml-0 dark:bg-gray-900"
                disabled={loadingMore}
                label={`View more ${page.type}`}
                onClick={() => fetchPosts(posts.length)}
              />
            )}
          </div>
        </div>
      </Page>
    </>
  );
}

PageDetail.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
