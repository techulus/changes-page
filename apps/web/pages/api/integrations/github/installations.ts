import { supabaseAdmin } from "@changespage/supabase/admin";
import { IGitHubInstallations } from "@changespage/supabase/types/github";
import { withAuth } from "../../../../utils/withAuth";

type ResponseData =
  | IGitHubInstallations
  | IGitHubInstallations[]
  | { deleted: boolean };

const handler = withAuth<ResponseData>(async (req, res, { supabase, user }) => {
  if (req.method === "GET") {
    const page_id = String(req.query.page_id || "");

    if (!page_id) {
      res.status(400).json({
        error: { statusCode: 400, message: "page_id is required" },
      });
      return;
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from("github_installations")
      .select("*")
      .eq("page_id", page_id);

    if (error) {
      res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
      return;
    }

    res.status(200).json(data as IGitHubInstallations[]);
    return;
  }

  if (req.method === "POST") {
    const { page_id, installation_id, repository_owner, repository_name } =
      req.body;

    if (!page_id || !installation_id || !repository_owner || !repository_name) {
      res.status(400).json({
        error: { statusCode: 400, message: "Missing required fields" },
      });
      return;
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from("github_installations")
      .upsert(
        {
          page_id,
          installation_id,
          repository_owner,
          repository_name,
          connected_by: user.id,
        },
        {
          onConflict: "page_id,repository_owner,repository_name",
        }
      )
      .select()
      .single();

    if (error) {
      res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
      return;
    }

    res.status(200).json(data as IGitHubInstallations);
    return;
  }

  if (req.method === "PATCH") {
    const { id, page_id, enabled, ai_instructions } = req.body;

    if (!id || !page_id) {
      res.status(400).json({
        error: { statusCode: 400, message: "id and page_id are required" },
      });
      return;
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
      return;
    }

    const updates: { enabled?: boolean; ai_instructions?: string | null } = {
      enabled: true,
    };
    if (typeof enabled === "boolean") updates.enabled = enabled;
    if (typeof ai_instructions === "string" || ai_instructions === null) {
      updates.ai_instructions = ai_instructions;
    }

    const { data, error } = await supabaseAdmin
      .from("github_installations")
      .update(updates)
      .eq("id", id)
      .eq("page_id", page_id)
      .select()
      .single();

    if (error) {
      res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
      return;
    }

    res.status(200).json(data as IGitHubInstallations);
    return;
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id || "");
    const page_id = String(req.query.page_id || "");

    if (!id || !page_id) {
      res.status(400).json({
        error: { statusCode: 400, message: "id and page_id are required" },
      });
      return;
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
      return;
    }

    const { error } = await supabaseAdmin
      .from("github_installations")
      .delete()
      .eq("id", id)
      .eq("page_id", page_id);

    if (error) {
      res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
      return;
    }

    res.status(200).json({ deleted: true });
    return;
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  res.status(405).end("Method Not Allowed");
});

export default handler;
