import {
  createPagesServerClient,
  Session,
  User,
} from "@supabase/auth-helpers-nextjs";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Database } from "@changes-page/supabase/types";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getSupabaseServerClient = async (
  context:
    | GetServerSidePropsContext
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
): Promise<{
  supabase: SupabaseClient<Database>;
  session: Session;
  user: User;
}> => {
  const supabase = createPagesServerClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    supabase,
    session,
    user: session?.user,
  };
};
