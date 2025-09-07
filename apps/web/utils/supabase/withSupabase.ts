import { Database } from "@changes-page/supabase/types";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerClientSSR } from "./server";

type SupabaseHandler<P = any> = (
  context: GetServerSidePropsContext,
  { supabase, user }: { supabase: SupabaseClient<Database>; user: User }
) => Promise<GetServerSidePropsResult<P>>;

export function withSupabase<P = any>(handler: SupabaseHandler<P>) {
  return async (context: GetServerSidePropsContext) => {
    const supabase = createServerClientSSR(context);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      const next = encodeURIComponent(context.resolvedUrl || "/");
      return {
        redirect: {
          destination: `/login?redirectedFrom=${next}`,
          permanent: false,
        },
      } as GetServerSidePropsResult<P>;
    }

    return handler(context, { supabase, user });
  };
}
