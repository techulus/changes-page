import { PostStatus } from "@changes-page/supabase/types/page";
import { NextApiRequest, NextApiResponse } from "next";
import { NewPostSchema } from "../../../data/schema";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createPost, getUserById } from "../../../utils/useDatabase";

const createNewPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      page_id,
      title,
      content,
      tags,
      status,
      images_folder,
      publish_at,
      notes,
      allow_reactions,
      email_notified,
      publication_date,
    } = req.body;

    try {
      await apiRateLimiter(req, res);

      const { user } = await getSupabaseServerClient({ req, res });

      const { has_active_subscription } = await getUserById(user.id);
      if (!has_active_subscription) {
        return res.status(403).json({
          error: { statusCode: 403, message: "Missing subscription" },
        });
      }

      const isValid = await NewPostSchema.isValid({
        page_id,
        title: title.trim(),
        content: content.trim(),
        tags,
        status,
        images_folder,
        publish_at,
        notes,
        allow_reactions,
        email_notified,
        publication_date,
      });

      if (!isValid) {
        return res.status(400).json({
          error: { statusCode: 400, message: "Invalid request body" },
        });
      }

      console.log("createNewPost", user?.id);

      const post = await createPost({
        user_id: user.id,
        page_id,
        title,
        content,
        tags,
        status,
        images_folder,
        publish_at,
        publication_date:
          publication_date ??
          (status === PostStatus.published ? new Date().toISOString() : null),
        notes: notes ?? "",
        allow_reactions: allow_reactions ?? false,
        email_notified: email_notified ?? false,
      });

      return res.status(201).json({ post });
    } catch (err) {
      console.log("createNewPost", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default createNewPost;
