import { supabaseAdmin } from "@changes-page/supabase/admin";
import { ROUTES } from "../../../../data/routes.data";
import { getAppBaseURL } from "../../../../utils/helpers";
import inngestClient from "../../../../utils/inngest";
import { apiRateLimiter } from "../../../../utils/rate-limit";
import { getUserById } from "../../../../utils/useDatabase";
import { withAuth } from "../../../../utils/withAuth";

const inviteUser = withAuth<{ ok: boolean }>(
  async (req, res, { user, supabase }) => {
    if (req.method === "POST") {
      const { team_id, email } = req.body;
      if (!team_id || !email) {
        return res.status(400).json({
          error: { statusCode: 400, message: "Invalid request" },
        });
      }

      try {
        await apiRateLimiter(req, res);

        const { has_active_subscription } = await getUserById(user.id);
        if (!has_active_subscription) {
          return res.status(403).json({
            error: { statusCode: 403, message: "Missing subscription" },
          });
        }

        if (user.email === email) {
          return res.status(400).json({
            error: { statusCode: 400, message: "You cannot invite yourself" },
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

        const { data: invitation, error: invitationError } = await supabaseAdmin
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

        if (!invitation || invitationError) {
          return res.status(500).json({
            error: { statusCode: 500, message: "Failed to create invitation" },
          });
        }

        await inngestClient.send({
          name: "email/team.invite",
          data: {
            email,
            payload: {
              owner_name: user.user_metadata?.name ?? user.email,
              team_name: team.name,
              confirm_link: `${getAppBaseURL()}${ROUTES.TEAMS}`,
            },
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
  }
);

export default inviteUser;
