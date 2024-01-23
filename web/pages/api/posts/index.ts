import { NextApiRequest, NextApiResponse } from "next";
import { PostStatus } from "../../../data/page.interface";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createPost } from "../../../utils/useDatabase";

const createNewPost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      page_id,
      title,
      content,
      type,
      status,
      images_folder,
      publish_at,
      notes,
      allow_reactions,
    } = req.body;

    try {
      await apiRateLimiter(req, res);

      const { user } = await getSupabaseServerClient({ req, res });

      console.log("createNewPost", user?.id);

      const post = await createPost({
        user_id: user.id,
        page_id,
        title,
        content,
        type,
        status,
        images_folder,
        publish_at,
        publication_date:
          status === PostStatus.published ? new Date().toISOString() : null,
        notes: notes ?? "",
        allow_reactions: allow_reactions ?? false,
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
