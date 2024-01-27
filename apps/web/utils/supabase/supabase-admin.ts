import { Database } from "@changes-page/supabase/types";
import {
  createPagesServerClient,
  Session,
  User,
} from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

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
