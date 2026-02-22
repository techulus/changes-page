import { supabaseAdmin } from "@changespage/supabase/admin";
import { PostStatus } from "@changespage/supabase/types/page";
import { NewPostSchema } from "../../../../data/schema";
import { withSecretKey } from "../../../../utils/withSecretKey";
import { IPublicPost, POST_SELECT_FIELDS } from "./shared";

export default withSecretKey<IPublicPost>(async (req, res, { page }) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ error: { statusCode: 400, message: "Missing post id" } });
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select(POST_SELECT_FIELDS)
      .eq("id", id)
      .eq("page_id", page.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res
          .status(404)
          .json({ error: { statusCode: 404, message: "Post not found" } });
      }
      return res
        .status(500)
        .json({ error: { statusCode: 500, message: error.message } });
    }

    return res.status(200).json(data);
  }

  if (req.method === "PATCH") {
    const UPDATABLE_FIELDS = ["title", "content", "tags", "status", "publish_at", "allow_reactions", "notes"] as const;

    const updates: Record<string, unknown> = {};
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.status === PostStatus.published) {
      updates.publication_date = new Date().toISOString();
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: "No fields to update" } });
    }

    try {
      const partialSchema = NewPostSchema.pick(Object.keys(updates) as (keyof typeof NewPostSchema.fields)[]);
      await partialSchema.validate(updates);
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
      .update(updates)
      .eq("id", id)
      .eq("page_id", page.id)
      .select(POST_SELECT_FIELDS)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res
          .status(404)
          .json({ error: { statusCode: 404, message: "Post not found" } });
      }
      return res
        .status(500)
        .json({ error: { statusCode: 500, message: error.message } });
    }

    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("page_id", page.id);

    if (error) {
      return res
        .status(500)
        .json({ error: { statusCode: 500, message: error.message } });
    }

    return res.status(204).end();
  }

  return res
    .status(405)
    .json({ error: { statusCode: 405, message: "Method not allowed" } });
});
