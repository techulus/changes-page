import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPage } from "@changes-page/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { NewPageSchema } from "../../../data/schema";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { getSupabaseServerClientForAPI } from "../../../utils/supabase/supabase-admin";
import {
  createPage,
  getUserById,
  updateSubscriptionUsage,
} from "../../../utils/useDatabase";

const createNewPage = async (
  req: NextApiRequest,
  res: NextApiResponse<IPage | IErrorResponse>
) => {
  if (req.method === "POST") {
    await apiRateLimiter(req, res);

    const { url_slug, title, description, type } = req.body;

    try {
      const { user } = await getSupabaseServerClientForAPI({ req, res });

      const { has_active_subscription } = await getUserById(user.id);
      if (!has_active_subscription) {
        return res.status(403).json({
          error: { statusCode: 403, message: "Missing subscription" },
        });
      }

      const isValid = await NewPageSchema.isValid({
        url_slug,
        title: title.trim(),
        description: description.trim(),
        type,
      });

      if (!isValid) {
        return res.status(400).json({
          error: { statusCode: 400, message: "Invalid request body" },
        });
      }

      console.log("createNewPage", user?.id);

      const data = await createPage({
        user_id: user.id,
        url_slug,
        title,
        description,
        type,
      });

      await updateSubscriptionUsage(user.id, `${data.id}-add`);

      return res.status(201).json(data);
    } catch (err) {
      console.log("createNewPage", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default createNewPage;
