import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { SpinnerWithSpacing } from "../../../components/core/spinner.component";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import {
  getSupabaseServerClient,
  supabaseAdmin,
} from "../../../utils/supabase/supabase-admin";
import { getPageAnalytics } from "../../../utils/useDatabase";
import { getPage } from "../../../utils/useSSR";

const StatsTable = ({ data, title, total = 5 }) => {
  return (
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
              >
                {title}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {data.map(({ data_name, data_count }) => (
              <tr key={data_name} className="relative">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 truncate overflow-hidden max-w-[240px]">
                  <div className="relative">
                    {data_name.startsWith("https") && (
                      <Image
                        className="w-4 h-4 mr-2 rounded-full inline-block"
                        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${
                          new URL(data_name).hostname
                        }`}
                        alt={`${data_name} icon`}
                        height={16}
                        width={16}
                      />
                    )}

                    {data_name.startsWith("http")
                      ? new URL(data_name).hostname
                      : data_name}
                    <div
                      className="block absolute -left-2 -top-2 h-9 bg-gray-200 dark:bg-gray-600 rounded opacity-10 invert transition-all duration-300"
                      style={{
                        width: `calc(${Math.round(
                          (data_count / data[0].data_count) * 100
                        )}% - 1rem)`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-32">
                  {data_count}
                </td>
              </tr>
            ))}

            {new Array(total - data.length).fill("-").map((_, idx) => (
              <tr key={idx}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 truncate overflow-hidden max-w-[240px]">
                  -
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-32">
                  -
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res, query }) {
  const { page_id, range } = query;

  const { supabase } = await getSupabaseServerClient({ req, res });
  const page = await getPage(supabase, page_id);

  // date {range} days ago
  const date = new Date(
    Date.now() - (Number(range) || 7) * 24 * 60 * 60 * 1000
  );
  console.log(`Fetching stats for page ${page_id} from ${date.toISOString()}`);

  const {
    // @ts-ignore
    data: { page_views, visitors },
  } = await supabaseAdmin
    .rpc("page_view_stats", {
      pageid: String(page_id),
      date: date.toISOString(),
    })
    .maybeSingle()
    .throwOnError();

  const stats = [
    {
      data_name: "Page Views",
      data_count: Number(page_views).toLocaleString(),
    },
    {
      data_name: "Visitors",
      data_count: Number(visitors).toLocaleString(),
    },
  ];

  const metrics = ["browsers", "os", "referrers"];
  const metricsData = await Promise.all(
    metrics.map((metric) => getPageAnalytics(page_id, metric, range))
  );

  return {
    props: {
      page,
      page_id,
      range: String(range ?? 7),
      stats,
      metricsData,
    },
  };
}

export default function PageAnalytics({
  page,
  page_id,
  range,
  stats,
  metricsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!page_id) return null;

  return (
    <Page
      title={page?.title}
      subtitle="Analytics"
      backRoute={`${ROUTES.PAGES}/${page_id}`}
      showBackButton={true}
      tabs={[
        {
          name: "Last 7 days",
          href: `${ROUTES.PAGES}/${page_id}/analytics?range=7`,
          current: range === "7",
        },
        {
          name: "Last 14 days",
          href: `${ROUTES.PAGES}/${page_id}/analytics?range=14`,
          current: range === "14",
        },
        {
          name: "Last 30 days",
          href: `${ROUTES.PAGES}/${page_id}/analytics?range=30`,
          current: range === "30",
        },
      ]}
    >
      {!page_id && <SpinnerWithSpacing />}

      <div>
        <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 px-4 md:px-0">
          {stats.map(({ data_name, data_count }) => (
            <div
              key={data_name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {data_name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                {data_count}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatsTable title="Browser" data={metricsData[0]} />
          <StatsTable title="OS" data={metricsData[1]} />
          <StatsTable title="Referrer" data={metricsData[2]} />
        </div>
      </div>
    </Page>
  );
}

PageAnalytics.getLayout = function getLayout(page: any) {
  return <AuthLayout>{page}</AuthLayout>;
};
