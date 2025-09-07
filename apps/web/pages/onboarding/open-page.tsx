import { supabaseAdmin } from "@changes-page/supabase/admin";
import { SpinnerWithSpacing } from "@changes-page/ui";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ROUTES } from "../../data/routes.data";
import { getSupabaseServerClientForSSR } from "../../utils/supabase/supabase-admin";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { user } = await getSupabaseServerClientForSSR(ctx);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const { path } = ctx.query;

  const { data: pages } = await supabaseAdmin
    .from("pages")
    .select("id")
    .match({ user_id: user.id });

  if (!pages || pages.length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: `${ROUTES.PAGES}/new`,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: `${ROUTES.PAGES}/${pages[0].id}/${path ?? ""}`,
    },
  };
};

function LoadingPage() {
  return <SpinnerWithSpacing />;
}

export default LoadingPage;
