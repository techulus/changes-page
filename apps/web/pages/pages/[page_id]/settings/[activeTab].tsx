import { SpinnerWithSpacing } from "@changespage/ui";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import CustomDomainSettings from "../../../../components/page-settings/custom-domain";
import NotificationsSettings from "../../../../components/page-settings/notifications";
import SocialLinksSettings from "../../../../components/page-settings/social-links";
import StyleSettings from "../../../../components/page-settings/style";
import { ROUTES } from "../../../../data/routes.data";
import usePageSettings from "../../../../utils/hooks/usePageSettings";
import { withSupabase } from "../../../../utils/supabase/withSupabase";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";
import { getPage } from "../../../../utils/useSSR";

const IntegrationsSettings = dynamic(
  () => import("../../../../components/page-settings/integrations"),
  {
    ssr: false,
  }
);

export const getServerSideProps = withSupabase(async (ctx, { supabase }) => {
  const { page_id } = ctx.params;
  if (!page_id || Array.isArray(page_id)) {
    return { notFound: true };
  }

  const page = await getPage(supabase, page_id).catch(() => null);
  if (!page) {
    return { notFound: true };
  }

  const settings = await createOrRetrievePageSettings(page_id);

  return {
    props: {
      page,
      settings,
      page_id,
      activeTab: ctx.params?.activeTab,
    },
  };
});

export default function PageSettings({
  page,
  settings: serverSettings,
  page_id,
  activeTab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { settings: clientSettings, updatePageSettings } = usePageSettings(
    page_id,
    false
  );

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  const tabs = useMemo(
    () => [
      {
        name: "General",
        current: activeTab === "general",
        href: `${ROUTES.PAGES}/${page_id}/settings/general`,
      },
      {
        name: "Notifications",
        current: activeTab === "notifications",
        href: `${ROUTES.PAGES}/${page_id}/settings/notifications`,
      },
      {
        name: "Links",
        current: activeTab === "links",
        href: `${ROUTES.PAGES}/${page_id}/settings/links`,
      },
      {
        name: "Integrations",
        current: activeTab === "integrations",
        href: `${ROUTES.PAGES}/${page_id}/settings/integrations`,
      },
    ],
    [activeTab, page_id]
  );

  if (!page_id) return null;

  return (
    <Page
      title={page?.title}
      subtitle="Settings"
      backRoute={`${ROUTES.PAGES}/${page_id}`}
      showBackButton={true}
      tabs={tabs}
    >
      {!settings && <SpinnerWithSpacing />}

      {settings && (
        <>
          {activeTab === "general" && (
            <>
              <CustomDomainSettings
                pageId={String(page_id)}
                settings={settings}
                updatePageSettings={updatePageSettings}
              />

              <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                  <div className="border-t border-gray-200 dark:border-gray-800" />
                </div>
              </div>

              <StyleSettings
                pageId={String(page_id)}
                page={page}
                settings={settings}
                updatePageSettings={updatePageSettings}
              />
            </>
          )}

          {activeTab === "notifications" && (
            <NotificationsSettings
              settings={settings}
              updatePageSettings={updatePageSettings}
            />
          )}

          {activeTab === "links" && (
            <SocialLinksSettings
              settings={settings}
              updatePageSettings={updatePageSettings}
            />
          )}

          {activeTab === "integrations" && (
            <IntegrationsSettings
              settings={settings}
              updatePageSettings={updatePageSettings}
              pageId={String(page_id)}
            />
          )}
        </>
      )}
    </Page>
  );
}

PageSettings.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};
