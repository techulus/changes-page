import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import { Timeline } from "@changes-page/ui";
import {
  ChartBarIcon,
  CodeIcon,
  CogIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
  HomeIcon,
  PencilAltIcon,
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
import { useMemo, useState, type JSX } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  PrimaryRouterButton,
  SecondaryButton,
  SidebarButton,
} from "../../../components/core/buttons.component";
import { MenuItem } from "../../../components/core/menu.component";
import ConfirmDeleteDialog from "../../../components/dialogs/confirm-delete-dialog.component";
import WidgetCodeDialog from "../../../components/dialogs/widget-code-dialog";
import {
  LoadingButtons,
  LoadingShimmer,
  NewPageOnboarding,
} from "../../../components/entity/empty-state";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { Post } from "../../../components/post/post";
import { PostStatusToIcon } from "../../../components/post/post-status";
import { ROUTES } from "../../../data/routes.data";
import usePageSettings from "../../../utils/hooks/usePageSettings";
import usePageUrl from "../../../utils/hooks/usePageUrl";
import usePosts from "../../../utils/hooks/usePosts";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../utils/useDatabase";
import { getPage } from "../../../utils/useSSR";
import { useUserData } from "../../../utils/useUser";

export async function getServerSideProps({ req, res, params }) {
  const { page_id } = params;

  const { supabase } = await getSupabaseServerClient({ req, res });
  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  const settings = await createOrRetrievePageSettings(String(page_id));

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
  const { supabase, user } = useUserData();
  const { status } = router.query;

  const [search, setSearch] = useState("");

  const { settings: clientSettings, updatePageSettings } = usePageSettings(
    page_id,
    false
  );

  const isPageOwner = useMemo(() => page?.user_id === user?.id, [page, user]);

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  const { pageUrl } = usePageUrl(page, settings);
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

  const managePageLinks = useMemo(() => {
    const links = pageUrl
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
            label: "Audit Logs",
            href: `${ROUTES.PAGES}/${page_id}/audit-logs`,
            icon: (props) => <DocumentTextIcon {...props} />,
          },
        ]
      : [];

    if (isPageOwner) {
      links.push({
        label: "Edit Page",
        href: `${ROUTES.PAGES}/${page_id}/edit`,
        icon: (props) => <PencilAltIcon {...props} />,
      });
    }

    return links;
  }, [pageUrl, page_id, isPageOwner]);

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
        highRiskAction
        riskVerificationText="delete page"
        open={openDeletePage && isPageOwner}
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
        containerClassName="lg:pb-0"
        buttons={
          <PrimaryRouterButton
            label="Post"
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
            {isPageOwner && (
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
            )}
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
              "relative pb-20 space-y-6 lg:px-0 lg:mr-8 lg:col-span-7",
              !loading && posts.length === 0
                ? "lg:col-span-9 lg:mr-0"
                : "lg:col-span-7 lg:mr-8"
            )}
          >
            <Timeline />
            <ul className="relative z-0">
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
                (pinnedPost ? [pinnedPost, ...posts] : posts).map(
                  (post: IPost) => (
                    <Post
                      key={post.id}
                      page={page}
                      post={post}
                      fetchPosts={fetchPosts}
                      settings={settings}
                      updatePageSettings={updatePageSettings}
                    />
                  )
                )}
              {loadingMore && <LoadingShimmer />}
            </ul>

            {!loading && posts?.length > 0 && page?.type && allowLoadMore && (
              <SecondaryButton
                className="my-3 ml-6 dark:bg-gray-900"
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
