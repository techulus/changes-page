import { Database } from "@changes-page/supabase/types";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { createServerClientForAPI, createServerClientSSR } from "./server";

export const getSupabaseServerClientForSSR = async (
  context: GetServerSidePropsContext
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

export const getSupabaseServerClientForAPI = async (context: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  supabase: SupabaseClient<Database>;
  session: Session | null;
  user: User | null;
}> => {
  const supabase = createServerClientForAPI(context);

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
