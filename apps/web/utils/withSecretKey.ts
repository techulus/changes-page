import { IErrorResponse } from "@changespage/supabase/types/api";
import { IPage } from "@changespage/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPageByIntegrationSecret } from "./useDatabase";

type SecretKeyHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T | IErrorResponse>,
  { page }: { page: IPage }
) => Promise<void> | void;

export function withSecretKey<T = unknown>(handler: SecretKeyHandler<T>) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<T | IErrorResponse>
  ) => {
    try {
      const secretKey = req.headers["page-secret-key"];

      if (!secretKey) {
        return res.status(401).json({
          error: { statusCode: 401, message: "Missing page-secret-key header" },
        });
      }

      const page = await getPageByIntegrationSecret(String(secretKey));

      if (!page) {
        return res.status(401).json({
          error: { statusCode: 401, message: "Invalid secret key" },
        });
      }

      return handler(req, res, { page });
    } catch (error) {
      console.error("Secret key auth error:", error);
      return res.status(401).json({
        error: { statusCode: 401, message: "Invalid secret key" },
      });
    }
  };
}
