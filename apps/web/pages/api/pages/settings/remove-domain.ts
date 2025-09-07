import { supabaseAdmin } from "@changes-page/supabase/admin";
import isFQDN from "validator/lib/isFQDN";
import { withAuth } from "../../../../utils/withAuth";

const removeDomain = withAuth<{ success: boolean }>(
  async (req, res, { user }) => {
    const { domain } = req.body;

    console.log("removeDomain", user?.id, `domain: ${domain}`);

    if (
      typeof domain !== "string" ||
      !isFQDN(domain, { require_tld: true, allow_underscores: false })
    ) {
      return res.status(400).json({ success: false });
    }

    // check custom domain ownership
    const { data, error } = await supabaseAdmin
      .from("page_settings")
      .select("page_id, pages(user_id)")
      .eq("custom_domain", domain)
      .single();
    if (!data || error || data?.pages?.user_id !== user.id) {
      return res.status(400).json({ success: false });
    }

    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.VERCEL_PAGES_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        },
        method: "DELETE",
      }
    );

    await response.json();

    res.status(200).json({
      success: true,
    });
  }
);

export default removeDomain;
