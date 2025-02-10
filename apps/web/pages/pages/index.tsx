import { PageType, PageTypeToLabel } from "@changes-page/supabase/types/page";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { PrimaryRouterButton } from "../../components/core/buttons.component";
import { notifyError } from "../../components/core/toast.component";
import { EntityEmptyState } from "../../components/entity/empty-state";
import AuthLayout from "../../components/layout/auth-layout.component";
import Page from "../../components/layout/page.component";
import Changelog from "../../components/marketing/changelog";
import { ROUTES } from "../../data/routes.data";
import { getAppBaseURL } from "../../utils/helpers";
import { getSupabaseServerClient } from "../../utils/supabase/supabase-admin";
import { useUserData } from "../../utils/useUser";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { supabase } = await getSupabaseServerClient(ctx);

  const { data: pages, error } = await supabase
    .from("pages")
    .select(
      `*,
      teams (
        id,
        name
      )
      `
    )
    .order("updated_at", { ascending: false });

  return {
    props: {
      pages: pages ?? [],
      error,
    },
  };
}

export default function Pages({
  pages,
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
                  ? `/pages/new`
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
            <div className="divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={classNames(
                    "relative group bg-white dark:bg-black p-6"
                  )}
                >
                  <div>
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
                        "inline-flex px-2 py-1 font-bold"
                      )}
                    >
                      {PageTypeToLabel[page.type]}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium dark:text-gray-50">
                      <a
                        href={`${ROUTES.PAGES}/${page.id}`}
                        className="focus:outline-none font-bold tracking-tight"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        {page.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
                      {page.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-gray-500 dark:text-gray-400 group-hover:text-indigo-400"
                    aria-hidden="true"
                  >
                    {page.teams && page.user_id !== user?.id ? (
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Editor ({page.teams.name})
                        </span>
                      </div>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Page>
    </>
  );
}

Pages.getLayout = (page: JSX.Element) => <AuthLayout>{page}</AuthLayout>;
