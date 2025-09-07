import { Database } from "@changes-page/supabase/types";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { createServerClientSSR } from "./server";

export const getSupabaseServerClient = async (
  context:
    | GetServerSidePropsContext
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
): Promise<{
  supabase: SupabaseClient<Database>;
  session: Session | null;
  user: User | null;
}> => {
  const supabase = createServerClientSSR(context);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    supabase,
    session,
    user,
  };
};
