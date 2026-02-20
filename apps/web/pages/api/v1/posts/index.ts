import { supabaseAdmin } from "@changespage/supabase/admin";
import { PostStatus } from "@changespage/supabase/types/page";
import { v4 } from "uuid";
import { NewPostSchema } from "../../../../data/schema";
import { withSecretKey } from "../../../../utils/withSecretKey";
import { IPublicPost, POST_SELECT_FIELDS } from "./shared";

export default withSecretKey<IPublicPost | IPublicPost[]>(async (req, res, { page }) => {
  if (req.method === "GET") {
    const { status, limit = "20", offset = "0" } = req.query;

    let query = supabaseAdmin
      .from("posts")
      .select(POST_SELECT_FIELDS)
      .eq("page_id", page.id)
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status && typeof status === "string") {
      if (!Object.values(PostStatus).includes(status as PostStatus)) {
        return res
          .status(400)
          .json({ error: { statusCode: 400, message: "Invalid status" } });
      }
      query = query.eq("status", status as PostStatus);
    }

    const { data, error } = await query;

    if (error) {
      return res
        .status(500)
        .json({ error: { statusCode: 500, message: error.message } });
    }

    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, tags, content, status, publish_at, allow_reactions, notes } =
      req.body;

    const images_folder = v4();
    const publication_date =
      status === PostStatus.published ? new Date().toISOString() : null;

    const postData = {
      title,
      content,
      tags: tags ?? [],
      status: status ?? PostStatus.draft,
      page_id: page.id,
      user_id: page.user_id,
      images_folder,
      publication_date,
      publish_at: publish_at ?? null,
      allow_reactions: allow_reactions ?? false,
      email_notified: false,
      notes: notes ?? null,
    };

    try {
      await NewPostSchema.validate(postData);
    } catch (validationError: unknown) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message:
            validationError instanceof Error
              ? validationError.message
              : "Validation failed",
        },
      });
    }

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([postData])
      .select(POST_SELECT_FIELDS);

    if (error) {
      return res
        .status(500)
        .json({ error: { statusCode: 500, message: error.message } });
    }

    return res.status(201).json(data[0]);
  }

  return res
    .status(405)
    .json({ error: { statusCode: 405, message: "Method not allowed" } });
});
