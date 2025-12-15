import Script from "next/script";
import FooterComponent from "../../components/layout/footer.component";
import HeaderComponent from "../../components/layout/header.component";
import Page from "../../components/layout/page.component";
import { withSupabase } from "../../utils/supabase/withSupabase";

export const getServerSideProps = withSupabase<{ email: string }>(
  async (_, { user }) => {
    return {
      props: { email: user?.email },
    };
  }
);

export default function Zapier({ email }: { email?: string }) {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800">
      <HeaderComponent />
      <Script
        src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        strategy="beforeInteractive"
      />

      <Page title="Automate using Zapier">
        <div className="relative pb-32 overflow-hidden">
          <div className="relative">
            <div className="lg:mx-auto lg:max-w-7xl text-center mx-4 md:mx-0">
              <zapier-workflow
                sign-up-email={email}
                client-id="rnKv828fHE7sPhcZdGhwqWbIsJkOfhUEh2RAHQw4"
                theme="auto"
                intro-copy-display="show"
                guess-zap-display="show"
                zap-create-from-scratch-display="show"
              />
            </div>
          </div>
        </div>
      </Page>

      <FooterComponent />
    </div>
  );
}
