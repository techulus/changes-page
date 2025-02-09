import { supabaseAdmin } from "@changes-page/supabase/admin";
import { NextApiRequest, NextApiResponse } from "next";
import { ROUTES } from "../../../../data/routes.data";
import inngestClient from "../../../../utils/inngest";
import { apiRateLimiter } from "../../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";
import { getUserById } from "../../../../utils/useDatabase";

const inviteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { team_id, email } = req.body;

    try {
      await apiRateLimiter(req, res);

      const { user, supabase } = await getSupabaseServerClient({ req, res });

      const { has_active_subscription } = await getUserById(user.id);
      if (!has_active_subscription) {
        return res.status(403).json({
          error: { statusCode: 403, message: "Missing subscription" },
        });
      }

      const { data: team } = await supabase
        .from("teams")
        .select("*")
        .eq("id", team_id)
        .eq("owner_id", user.id)
        .single();

      if (!team) {
        return res.status(403).json({
          error: { statusCode: 403, message: "Team not found" },
        });
      }

      const { data: invitation } = await supabaseAdmin
        .from("team_invitations")
        .insert({
          team_id,
          inviter_id: user.id,
          email,
          role: "editor",
          status: "pending",
        })
        .select()
        .single();

      if (!invitation) {
        return res.status(500).json({
          error: { statusCode: 500, message: "Failed to create invitation" },
        });
      }

      await inngestClient.send({
        name: "email/team.invite",
        data: {
          owner_name: user.user_metadata?.name ?? user.email,
          team_name: team.name,
          confirm_link: `${process.env.NEXT_PUBLIC_APP_URL}/${ROUTES.TEAMS}`,
        },
      });

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

export default inviteUser;
