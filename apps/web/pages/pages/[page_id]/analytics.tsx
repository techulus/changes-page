import { supabaseAdmin } from "@changes-page/supabase/admin";
import { SpinnerWithSpacing } from "@changes-page/ui";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import AuthLayout from "../../../components/layout/auth-layout.component";
import Page from "../../../components/layout/page.component";
import { ROUTES } from "../../../data/routes.data";
import { getSupabaseServerClientForSSR } from "../../../utils/supabase/supabase-admin";
import { getPageAnalytics } from "../../../utils/useDatabase";
import { getPage } from "../../../utils/useSSR";

// Helper function to detect device type from user agent
const getDeviceType = (userAgent: string): string => {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("windows phone") ||
    ua.includes("blackberry")
  ) {
    return "Mobile";
  }

  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "Tablet";
  }

  return "Desktop";
};

// Get device analytics using existing data
async function getDeviceAnalytics(page_id: string, range: number) {
  const date = new Date(Date.now() - range * 24 * 60 * 60 * 1000);

  const { data } = await supabaseAdmin
    .from("page_views")
    .select("user_agent")
    .eq("page_id", page_id)
    .gte("created_at", date.toISOString())
    .not("user_agent", "is", null);

  const deviceCounts = {};

  data?.forEach((row) => {
    const device = getDeviceType(row.user_agent);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  return Object.entries(deviceCounts)
    .map(([device, count]) => ({
      data_name: device,
      data_count: count as number,
    }))
    .sort((a, b) => b.data_count - a.data_count);
}

// Get peak hours analytics using existing data
async function getPeakHoursAnalytics(page_id: string, range: number) {
  const date = new Date(Date.now() - range * 24 * 60 * 60 * 1000);

  const { data } = await supabaseAdmin
    .from("page_views")
    .select("created_at")
    .eq("page_id", page_id)
    .gte("created_at", date.toISOString());

  const hourCounts = {};

  data?.forEach((row) => {
    const hour = new Date(row.created_at).getHours();
    const hourLabel = `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
      .toString()
      .padStart(2, "0")}:00`;
    hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
  });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({
      data_name: hour,
      data_count: count as number,
    }))
    .sort((a, b) => b.data_count - a.data_count)
    .slice(0, 5);
}

const StatsTable = ({ data = [], title, total = 5 }) => {
  const totalCount = data.reduce((sum, item) => sum + item.data_count, 0);

  return (
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
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
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-black">
            {data.map(({ data_name, data_count }) => {
              const percentage =
                totalCount > 0
                  ? ((data_count / totalCount) * 100).toFixed(1)
                  : 0;

              return (
                <tr key={data_name} className="relative">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 truncate overflow-hidden max-w-[200px]">
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
                        className="block absolute -left-2 -top-2 h-9 bg-indigo-100 dark:bg-indigo-900 rounded opacity-20 transition-all duration-300"
                        style={{
                          width: `calc(${percentage}% - 1rem)`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-20">
                    {data_count.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-16">
                    {percentage}%
                  </td>
                </tr>
              );
            })}

            {new Array(Math.max(total - data?.length, 0))
              .fill("-")
              .map((_, idx) => (
                <tr key={idx}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 truncate overflow-hidden max-w-[200px]">
                    -
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-20">
                    -
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-16">
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { range } = ctx.query;
  const page_id = String(ctx.params?.page_id);

  const { supabase } = await getSupabaseServerClientForSSR(ctx);
  const page = await getPage(supabase, page_id);

  const rangeNum = Number(range) || 7;

  const date = new Date(Date.now() - rangeNum * 24 * 60 * 60 * 1000);
  const prevDate = new Date(Date.now() - rangeNum * 2 * 24 * 60 * 60 * 1000);

  console.log(`Fetching stats for page ${page_id} from ${date.toISOString()}`);

  const { data: allPageViews } = await supabaseAdmin
    .from("page_views")
    .select("created_at, visitor_id")
    .eq("page_id", page_id)
    .gte("created_at", prevDate.toISOString());

  const currentPeriodViews =
    allPageViews?.filter((view) => new Date(view.created_at) >= date) || [];

  const previousPeriodViews =
    allPageViews?.filter(
      (view) =>
        new Date(view.created_at) >= prevDate &&
        new Date(view.created_at) < date
    ) || [];

  const page_views = currentPeriodViews.length;
  const visitors = new Set(currentPeriodViews.map((v) => v.visitor_id)).size;
  const prev_page_views = previousPeriodViews.length;
  const prev_visitors = new Set(previousPeriodViews.map((v) => v.visitor_id))
    .size;

  // Calculate growth rates
  const pageViewsGrowth =
    prev_page_views > 0
      ? (((page_views - prev_page_views) / prev_page_views) * 100).toFixed(1)
      : page_views > 0
      ? 100
      : 0;

  const visitorsGrowth =
    prev_visitors > 0
      ? (((visitors - prev_visitors) / prev_visitors) * 100).toFixed(1)
      : visitors > 0
      ? 100
      : 0;

  // Calculate engagement rate (page views per visitor)
  const engagementRate = visitors > 0 ? (page_views / visitors).toFixed(1) : 0;

  const stats = [
    {
      data_name: "Page Views",
      data_count: Number(page_views).toLocaleString(),
      growth: pageViewsGrowth,
      trend: Number(pageViewsGrowth) >= 0 ? "up" : "down",
    },
    {
      data_name: "Visitors",
      data_count: Number(visitors).toLocaleString(),
      growth: visitorsGrowth,
      trend: Number(visitorsGrowth) >= 0 ? "up" : "down",
    },
    {
      data_name: "Engagement Rate",
      data_count: `${engagementRate}`,
      suffix: " views/visitor",
      growth: null,
      trend: null,
    },
  ];

  // Get device type data by analyzing user agents
  const deviceData = await getDeviceAnalytics(page_id, rangeNum);

  // Get peak hours data
  const peakHoursData = await getPeakHoursAnalytics(page_id, rangeNum);

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
      deviceData,
      peakHoursData,
    },
  };
}

export default function PageAnalytics({
  page,
  page_id,
  range,
  stats,
  metricsData,
  deviceData,
  peakHoursData,
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
          {stats.map(({ data_name, data_count, growth, trend, suffix }) => (
            <div
              key={data_name}
              className="overflow-hidden rounded-lg bg-white dark:bg-black px-6 py-6 shadow sm:p-8"
            >
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3">
                {data_name}
              </dt>
              <dd className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {data_count}
                {suffix && (
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                    {suffix}
                  </span>
                )}
              </dd>
              {growth !== null && (
                <div className="flex items-center text-sm">
                  <span
                    className={`flex items-center font-medium ${
                      trend === "up"
                        ? "text-green-600"
                        : trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {trend === "up" && (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {trend === "down" && (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {Math.abs(Number(growth))}% vs previous period
                  </span>
                </div>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatsTable title="Browser" data={metricsData[0]} />
          <StatsTable title="OS" data={metricsData[1]} />
          <StatsTable title="Device Type" data={deviceData} />
          <StatsTable title="Peak Hours" data={peakHoursData} />
          <div className="sm:col-span-2">
            <StatsTable title="Referrer" data={metricsData[2]} />
          </div>
        </div>
      </div>
    </Page>
  );
}

PageAnalytics.getLayout = function getLayout(page: any) {
  return <AuthLayout>{page}</AuthLayout>;
};
