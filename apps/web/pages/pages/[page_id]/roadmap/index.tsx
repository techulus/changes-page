import { PlusIcon } from "@heroicons/react/solid";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useMemo, type JSX } from "react";
import { PrimaryRouterButton } from "../../../../components/core/buttons.component";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import { ROUTES } from "../../../../data/routes.data";
import { withSupabase } from "../../../../utils/supabase/withSupabase";
import { getPage } from "../../../../utils/useSSR";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const { page_id } = ctx.params;
  if (!page_id || Array.isArray(page_id)) {
    return { notFound: true };
  }

  const page = await getPage(supabase, page_id).catch((e) => {
    console.error("Failed to get page", e);
    return null;
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  const { data: boards, error: boardsError } = await supabase
    .from("roadmap_boards")
    .select("*")
    .eq("page_id", page_id)
    .order("created_at", { ascending: false });

  if (boardsError) {
    console.error("Failed to fetch roadmap boards", boardsError);
  }

  return {
    props: {
      page_id,
      page,
      boards: boards || [],
    },
  };
});

export default function RoadmapPage({
  page,
  page_id,
  boards,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const viewTabs = useMemo(
    () => [
      {
        name: "Changelog",
        current: false,
        href: `/pages/${page_id}`,
      },
      {
        name: "Roadmap",
        current: true,
        href: `/pages/${page_id}/roadmap`,
      },
    ],
    [page_id]
  );

  if (!page_id) return null;

  return (
    <Page
      title={page?.title}
      subtitle="Roadmap"
      showBackButton={true}
      backRoute={ROUTES.PAGES}
      containerClassName="lg:pb-0"
      tabs={viewTabs}
      buttons={
        <PrimaryRouterButton
          label="New Board"
          icon={<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />}
          route={`/pages/${page_id}/roadmap/new`}
        />
      }
    >
      <div className="space-y-6">
        {boards.length === 0 ? (
          <div className="text-center py-12">
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
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No roadmap boards
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first roadmap board.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/pages/${page_id}/roadmap/${board.id}`}
                className="block group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {board.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            board.is_public
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {board.is_public ? "Public" : "Private"}
                        </span>
                      </div>

                      {board.description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide font-medium">
                          Created
                        </p>
                        <p>
                          {new Date(board.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

RoadmapPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
