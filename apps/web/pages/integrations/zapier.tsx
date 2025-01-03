import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import FooterComponent from "../../components/layout/footer.component";
import HeaderComponent from "../../components/layout/header.component";
import Page from "../../components/layout/page.component";
import { getSupabaseServerClient } from "../../utils/supabase/supabase-admin";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { user } = await getSupabaseServerClient(ctx);

  return {
    props: { email: user.email },
  };
}

export default function Zapier({ email }: { email: string }) {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800">
      <HeaderComponent />
      <Head>
        <script
          type="module"
          src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        ></script>
      </Head>

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
