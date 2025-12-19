import { supabaseAdmin } from "@changespage/supabase/admin";
import { SpinnerWithSpacing } from "@changespage/ui";
import { ROUTES } from "../../data/routes.data";
import { withSupabase } from "../../utils/supabase/withSupabase";

export const getServerSideProps = withSupabase<{
  redirect: {
    permanent: boolean;
    destination: string;
  };
}>(async (ctx, { user }) => {
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
});

function LoadingPage() {
  return <SpinnerWithSpacing />;
}

export default LoadingPage;
