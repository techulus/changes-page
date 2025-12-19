import { Database } from "@changespage/supabase/types";
import { IErrorResponse } from "@changespage/supabase/types/api";
import { SupabaseClient, User } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClientForAPI } from "./supabase/server";

type AuthenticatedHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T | IErrorResponse>,
  { supabase, user }: { supabase: SupabaseClient<Database>; user: User }
) => Promise<void> | void;

export function withAuth<T = unknown>(handler: AuthenticatedHandler<T>) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<T | IErrorResponse>
  ) => {
    try {
      const supabase = createServerClientForAPI({ req, res });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        return res.status(401).json({
          error: { statusCode: 401, message: "Unauthorized" },
        });
      }

      return handler(req, res, { supabase, user });
    } catch (error) {
      console.error("Auth wrapper error:", error);
      return res.status(500).json({
        error: { statusCode: 500, message: "Internal server error" },
      });
    }
  };
}
