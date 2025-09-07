import { supabaseAdmin } from "@changes-page/supabase/admin";
import { NextApiRequest, NextApiResponse } from "next";
import { apiRateLimiter } from "../../../../../utils/rate-limit";
import { getSupabaseServerClientForAPI } from "../../../../../utils/supabase/supabase-admin";

const acceptInvite = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { invite_id } = req.body;
    if (!invite_id) {
      return res.status(400).json({
        error: { statusCode: 400, message: "Invalid request" },
      });
    }

    try {
      await apiRateLimiter(req, res);

      const { user, supabase } = await getSupabaseServerClientForAPI({
        req,
        res,
      });
      if (!user) {
        return res.status(401).json({
          error: { statusCode: 401, message: "Unauthorized" },
        });
      }

      const { data: invite } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("id", invite_id)
        .ilike("email", user.email)
        .single();

      if (!invite) {
        return res.status(403).json({
          error: { statusCode: 403, message: "Team not found" },
        });
      }

      const { data: membership } = await supabaseAdmin
        .from("team_members")
        .insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: invite.role,
        })
        .select()
        .single();

      if (!membership) {
        return res.status(500).json({
          error: { statusCode: 500, message: "Failed to create invitation" },
        });
      }

      await supabaseAdmin.from("team_invitations").delete().eq("id", invite_id);

      return res.status(201).json({ ok: true });
    } catch (err) {
      console.log("inviteUser", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST,PUT");
    res.status(405).end("Method Not Allowed");
  }
};

export default acceptInvite;
