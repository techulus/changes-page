import type { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import {
  createPage,
  getPagesCount,
  getUserById,
  updateSubscriptionUsage,
} from "../../../utils/useDatabase";
import { IPage } from "@changes-page/supabase/types/page";

const createNewPage = async (
  req: NextApiRequest,
  res: NextApiResponse<IPage | IErrorResponse>
) => {
  if (req.method === "POST") {
    await apiRateLimiter(req, res);

    const { url_slug, title, description, type } = req.body;

    try {
      const { user } = await getSupabaseServerClient({ req, res });

      const userDetails = await getUserById(user.id);

      console.log("createNewPage", user?.id);

      const usageQuantity = await getPagesCount(user.id);

      console.log("usageQuantity", user?.id, usageQuantity);

      // Allow users to create page without subscription
      if (usageQuantity > 1 && !userDetails.stripe_subscription_id) {
        throw new Error("Please subscribe to create pages");
      }

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
