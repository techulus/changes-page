import { CheckCircleIcon } from "@heroicons/react/outline";
import type { GetServerSideProps } from "next";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import PageHeader from "../../../../components/page-header";
import SeoTags from "../../../../components/seo-tags";
import {
  IPageSettings,
  IPageWithSettings,
} from "../../../../data/page.interface";
import { fetchRenderData } from "../../../../lib/data";
import { verifyPageEmailToken } from "../../../../lib/notifications";

export default function Index({
  page,
  settings,
}: {
  page: IPageWithSettings;
  settings: IPageSettings;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings?.color_scheme != "auto") {
      setTheme(settings?.color_scheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.color_scheme]);

  return (
    <>
      <SeoTags page={page} settings={settings} posts={[]} />

      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <PageHeader page={page} settings={settings} />

        <main>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-md bg-green-50 dark:bg-green-900 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-50">
                    Welcome! 👋
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-100">
                    <p>
                      You have successfully subscribed to receive email updates
                      from us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { site } = context.query;

  if (!site) {
    throw new Error("URL slug or domain is missing");
  }

  const email = context?.query?.email as string;
  const recipientId = context?.query?.token as string;
  const pageId = context?.query?.page_id as string;

  if (!email || !recipientId || !pageId) {
    return {
      notFound: true,
    };
  }

  try {
    const { page, settings } = await fetchRenderData(String(site));

    if (!page) throw new Error("Page not found");
    if (!settings) throw new Error("Settings not found");

    await verifyPageEmailToken(pageId, email, recipientId);

    return {
      props: {
        page,
        settings,
        ok: true,
      },
    };
  } catch (e) {
    console.log("Error: [confirm-email-subscription]:", e);
    return {
      notFound: true,
    };
  }
};
