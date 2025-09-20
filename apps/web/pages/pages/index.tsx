import { PageType, PageTypeToLabel } from "@changes-page/supabase/types/page";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { type JSX, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { PrimaryRouterButton } from "../../components/core/buttons.component";
import { notifyError } from "../../components/core/toast.component";
import { EntityEmptyState } from "../../components/entity/empty-state";
import AuthLayout from "../../components/layout/auth-layout.component";
import Page from "../../components/layout/page.component";
import Changelog from "../../components/marketing/changelog";
import { ROUTES } from "../../data/routes.data";
import { getPageScreenshotUrl } from "../../utils/capture";
import { getAppBaseURL } from "../../utils/helpers";
import { withSupabase } from "../../utils/supabase/withSupabase";
import { useUserData } from "../../utils/useUser";

export const getServerSideProps = withSupabase(async (_, { supabase }) => {
  const { data: pages, error } = await supabase
    .from("pages")
    .select(
      `*,
      teams (
        id,
        name
      ),
      page_settings (
        custom_domain
      )
      `
    )
    .order("updated_at", { ascending: false });

  const screenshots = pages.map((page) =>
    getPageScreenshotUrl(
      page.page_settings?.custom_domain
        ? `https://${page.page_settings.custom_domain}`
        : `https://${page.url_slug}.changes.page`
    )
  );

  return {
    props: {
      pages: pages ?? [],
      screenshots,
      error,
    },
  };
});

export default function Pages({
  pages,
  screenshots,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { billingDetails, user } = useUserData();
  const router = useRouter();
  useHotkeys("n", () => router.push(ROUTES.NEW_PAGE), [router]);

  useEffect(() => {
    if (error) {
      notifyError("Failed to fetch pages");
    }
  }, [error]);

  return (
    <>
      <Page
        title={"My Pages"}
        buttons={
          <PrimaryRouterButton
            label="Page"
            icon={
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            }
            route={ROUTES.NEW_PAGE}
            keyboardShortcut={"n"}
            upgradeRequired={!billingDetails?.has_active_subscription}
          />
        }
      >
        {billingDetails?.has_active_subscription ? <Changelog /> : null}

        <div className="overflow-hidden">
          {!pages.length && (
            <EntityEmptyState
              title="No pages yet!"
              message="Get started by creating your first page."
              buttonLink={
                billingDetails?.has_active_subscription
                  ? "/pages/new"
                  : `/api/billing/redirect-to-checkout?return_url=${getAppBaseURL()}/pages`
              }
              buttonLabel={
                billingDetails?.has_active_subscription
                  ? "Create New Page"
                  : "Start Free Trial"
              }
              footer={
                <div className="mt-4 text-sm">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://hey.changes.page"
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    or View our page
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </div>
              }
            />
          )}

          {pages.length ? (
            <div className="overflow-hidden shadow rounded-md bg-white dark:bg-gray-900 border dark:border-gray-800">
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {pages.map((page, idx) => (
                  <li
                    key={page.id}
                    className="relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 hidden sm:block">
                          <img
                            className="w-48 h-18 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                            src={screenshots[idx]}
                            alt={`Screenshot of ${page.title}`}
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={classNames(
                                page.type === PageType.announcements &&
                                  "bg-blue-100 dark:bg-blue-700",
                                page.type === PageType.changelogs &&
                                  "bg-teal-100 dark:bg-teal-700",
                                page.type === PageType.releases &&
                                  "bg-rose-100 dark:bg-rose-700",
                                page.type === PageType.updates &&
                                  "bg-amber-100 dark:bg-amber-700",
                                page.type === PageType.announcements &&
                                  "text-blue-500 dark:text-blue-100",
                                page.type === PageType.changelogs &&
                                  "text-teal-500 dark:text-teal-100",
                                page.type === PageType.releases &&
                                  "text-rose-500 dark:text-rose-100",
                                page.type === PageType.updates &&
                                  "text-amber-500 dark:text-amber-100",
                                "inline-flex px-2 py-1 text-xs font-bold rounded-md"
                              )}
                            >
                              {PageTypeToLabel[page.type]}
                            </span>
                            {page.teams && page.user_id !== user?.id && (
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <UserGroupIcon className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  Editor ({page.teams.name})
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                              <Link
                                href={`${ROUTES.PAGES}/${page.id}`}
                                className="focus:outline-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                              >
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {page.title}
                              </Link>
                            </h3>
                            {page.description && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {page.description}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                              {page.page_settings?.custom_domain
                                ? page.page_settings.custom_domain
                                : `${page.url_slug}.changes.page`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <title>Go to page</title>
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Page>
    </>
  );
}

Pages.getLayout = (page: JSX.Element) => <AuthLayout>{page}</AuthLayout>;
