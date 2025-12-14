import { supabaseAdmin } from "@changes-page/supabase/admin";
import { withAuth } from "../../../../utils/withAuth";

interface GitHubInstallation {
  id: string;
  page_id: string;
  installation_id: number;
  repository_owner: string;
  repository_name: string;
  connected_by: string | null;
  enabled: boolean;
  ai_instructions: string | null;
  created_at: string;
  updated_at: string;
}

type ResponseData =
  | GitHubInstallation
  | GitHubInstallation[]
  | { deleted: boolean };

const handler = withAuth<ResponseData>(async (req, res, { supabase, user }) => {
  if (req.method === "GET") {
    const { page_id } = req.query;

    if (!page_id) {
      return res.status(400).json({
        error: { statusCode: 400, message: "page_id is required" },
      });
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      return res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
    }

    const { data, error } = await supabaseAdmin
      .from("github_installations")
      .select("*")
      .eq("page_id", page_id);

    if (error) {
      return res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
    }

    return res.status(200).json(data as GitHubInstallation[]);
  }

  if (req.method === "POST") {
    const { page_id, installation_id, repository_owner, repository_name } =
      req.body;

    if (!page_id || !installation_id || !repository_owner || !repository_name) {
      return res.status(400).json({
        error: { statusCode: 400, message: "Missing required fields" },
      });
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      return res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
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
      return res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
    }

    return res.status(200).json(data as GitHubInstallation);
  }

  if (req.method === "PATCH") {
    const { id, page_id, enabled, ai_instructions } = req.body;

    if (!id || !page_id) {
      return res.status(400).json({
        error: { statusCode: 400, message: "id and page_id are required" },
      });
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      return res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
    }

    const updates: { enabled?: boolean; ai_instructions?: string | null } = {};
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
      return res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
    }

    return res.status(200).json(data as GitHubInstallation);
  }

  if (req.method === "DELETE") {
    const { id, page_id } = req.query;

    if (!id || !page_id) {
      return res.status(400).json({
        error: { statusCode: 400, message: "id and page_id are required" },
      });
    }

    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("id", page_id)
      .eq("user_id", user.id)
      .single();

    if (!page) {
      return res.status(403).json({
        error: { statusCode: 403, message: "Access denied" },
      });
    }

    const { error } = await supabaseAdmin
      .from("github_installations")
      .delete()
      .eq("id", id)
      .eq("page_id", page_id);

    if (error) {
      return res.status(500).json({
        error: { statusCode: 500, message: error.message },
      });
    }

    return res.status(200).json({ deleted: true });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).end("Method Not Allowed");
});

export default handler;
