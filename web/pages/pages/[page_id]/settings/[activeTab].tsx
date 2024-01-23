import { InferGetServerSidePropsType } from "next";
import { useMemo } from "react";
import { SpinnerWithSpacing } from "../../../../components/core/spinner.component";
import AuthLayout from "../../../../components/layout/auth-layout.component";
import Page from "../../../../components/layout/page.component";
import CustomDomainSettings from "../../../../components/page-settings/custom-domain";
import IntegrationsSettings from "../../../../components/page-settings/integrations";
import NotificationsSettings from "../../../../components/page-settings/notifications";
import SocialLinksSettings from "../../../../components/page-settings/social-links";
import StyleSettings from "../../../../components/page-settings/style";
import { ROUTES } from "../../../../data/routes.data";
import usePageSettings from "../../../../utils/hooks/usePageSettings";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";
import { getPage } from "../../../../utils/useSSR";
import { useUserData } from "../../../../utils/useUser";

export async function getServerSideProps({ req, res, params }) {
  const { page_id } = params;

  const { user, supabase } = await getSupabaseServerClient({ req, res });
  const settings = await createOrRetrievePageSettings(user.id, String(page_id));
  const page = await getPage(supabase, page_id);

  return {
    props: {
      page,
      settings,
      page_id,
      activeTab: params.activeTab,
    },
  };
}

export default function PageSettings({
  page,
  settings: serverSettings,
  page_id,
  activeTab,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { billingDetails } = useUserData();
  const { settings: clientSettings, updatePageSettings } = usePageSettings(
    page_id,
    false
  );

  const settings = useMemo(
    () => clientSettings ?? serverSettings,
    [serverSettings, clientSettings]
  );

  const tabs = useMemo(
    () =>
      billingDetails?.hasActiveSubscription
        ? [
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
          ]
        : [
            {
              name: "General",
              current: activeTab === "general",
              href: `${ROUTES.PAGES}/${page_id}/settings/general`,
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
    [activeTab, billingDetails?.hasActiveSubscription, page_id]
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
              {billingDetails?.hasActiveSubscription && (
                <>
                  <CustomDomainSettings
                    pageId={String(page_id)}
                    settings={settings}
                    updatePageSettings={updatePageSettings}
                  />

                  <div className="hidden sm:block" aria-hidden="true">
                    <div className="py-5">
                      <div className="border-t border-gray-200 dark:border-gray-600" />
                    </div>
                  </div>
                </>
              )}
              <StyleSettings
                pageId={String(page_id)}
                page={page}
                settings={settings}
                updatePageSettings={updatePageSettings}
              />
            </>
          )}

          {activeTab === "notifications" &&
            billingDetails?.hasActiveSubscription && (
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
            />
          )}
        </>
      )}
    </Page>
  );
}

PageSettings.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
