import { PostStatus } from "@changes-page/supabase/types/page";
import { NextApiRequest, NextApiResponse } from "next";
import { NewPostSchema } from "../../../data/schema";
import { apiRateLimiter } from "../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";
import { createPost } from "../../../utils/useDatabase";

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

      const { user, supabase } = await getSupabaseServerClient({ req, res });

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

      const { data: page, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("id", page_id)
        .single();

      if (pageError) throw pageError;
      if (!page) throw new Error("User does not have access to this page");

      console.log("createNewPost", user?.id);

      const postPayload = {
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
      };

      const post = await createPost(postPayload);

      await supabase.from("page_audit_logs").insert({
        page_id,
        actor_id: user.id,
        action: `Created Post: ${post.title}`,
        changes: postPayload,
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
