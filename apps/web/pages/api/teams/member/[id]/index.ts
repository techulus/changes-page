import { supabaseAdmin } from "@changespage/supabase/admin";
import { apiRateLimiter } from "../../../../../utils/rate-limit";
import { getUserById } from "../../../../../utils/useDatabase";
import { withAuth } from "../../../../../utils/withAuth";

const getTeamMemberDetails = withAuth(async (req, res, { user }) => {
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
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

      const { data: teamMember, error: teamMemberError } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .eq("id", String(id))
        .single();

      if (teamMemberError) {
        return res.status(500).json({
          error: { statusCode: 500, message: "Internal server error" },
        });
      }

      const { data: memeberDetails, error: memeberDetailsError } =
        await supabaseAdmin.auth.admin.getUserById(teamMember.user_id);
      if (memeberDetailsError) {
        return res.status(500).json({
          error: { statusCode: 500, message: "Internal server error" },
        });
      }

      return res.status(200).json({
        email: memeberDetails.user.email,
        name: memeberDetails.user.user_metadata.name,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { statusCode: 500, message: "Internal server error" },
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
});

export default getTeamMemberDetails;
