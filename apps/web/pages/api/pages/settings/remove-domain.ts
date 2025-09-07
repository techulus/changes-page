import { withAuth } from "../../../../utils/withAuth";

const removeDomain = withAuth<{ success: boolean }>(
  async (req, res, { user }) => {
    const { domain } = req.body;

    console.log("removeDomain", user?.id, `domain: ${domain}`);

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
