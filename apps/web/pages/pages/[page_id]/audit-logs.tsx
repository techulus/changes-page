import { supabaseAdmin } from "@changespage/supabase/admin";
import { Timeline } from "@changespage/ui";
import { DateTime } from "@changespage/utils";
import {
  ClockIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { InferGetServerSidePropsType } from "next";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import { withSupabase } from "../../../utils/supabase/withSupabase";
import { getPage } from "../../../utils/useSSR";

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const page_id = ctx.params?.page_id;
  if (!page_id || Array.isArray(page_id)) {
    return { notFound: true };
  }

  const page = await getPage(supabase, page_id);

  const { data: audit_logs } = await supabaseAdmin
    .from("page_audit_logs")
    .select("*, actor:actor_id(full_name)")
    .eq("page_id", page_id)
    .limit(100)
    .order("created_at", { ascending: false });

  return {
    props: {
      page,
      page_id,
      audit_logs: audit_logs ?? [],
    },
  };
});

export default function PageAnalytics({
  page,
  page_id,
  audit_logs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Page
      title={page?.title}
      subtitle="Audit Logs"
      backRoute={`${ROUTES.PAGES}/${page_id}`}
      showBackButton={true}
    >
      <div className="relative -mt-4 max-w-3xl mx-auto">
        <Timeline />
        {audit_logs.length > 0 ? (
          <ul role="list" className="space-y-6">
            {audit_logs.map((log) => (
              <li key={log.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 sm:-ml-8 sm:z-[2]">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800">
                        {log.action.toLowerCase().includes("delete") ? (
                          <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-300" />
                        ) : log.action.toLowerCase().includes("create") ? (
                          <PlusIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
                        ) : log.action.toLowerCase().includes("update") ? (
                          <PencilIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {log.actor?.full_name || log.actor_id}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        {log.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <time dateTime={log.created_at} suppressHydrationWarning>
                      {DateTime.fromISO(log.created_at).toNiceFormat()}
                    </time>
                  </div>
                </div>

                {log.changes && Object.keys(log.changes).length > 0 && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-950 rounded-md p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Changes
                    </p>
                    <div className="space-y-2">
                      {Object.entries(log.changes)
                        .filter(([key]) => key !== "created_at")
                        .filter(
                          ([key]) =>
                            !key.includes("id") && !key.includes("image")
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex items-start">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                              {typeof value === "object"
                                ? JSON.stringify(value, null, 2).slice(0, 100) +
                                  (JSON.stringify(value).length > 100
                                    ? "..."
                                    : "")
                                : String(value).slice(0, 100) +
                                  (String(value).length > 100 ? "..." : "")}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 p-12">
            No audit logs found
          </div>
        )}
      </div>
    </Page>
  );
}

PageAnalytics.getLayout = function getLayout(page: any) {
  return <AuthLayout>{page}</AuthLayout>;
};
