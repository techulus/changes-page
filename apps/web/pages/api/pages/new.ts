import { IPage } from "@changespage/supabase/types/page";
import { NewPageSchema } from "../../../data/schema";
import {
  createPage,
  getUserById,
  updateSubscriptionUsage,
} from "../../../utils/useDatabase";
import { withAuth } from "../../../utils/withAuth";

const createNewPage = withAuth<IPage>(async (req, res, { user }) => {
  if (req.method === "POST") {
    const { url_slug, title, description, type } = req.body;

    try {
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
});

export default createNewPage;
