import { NextApiRequest, NextApiResponse } from "next";
import { apiRateLimiter } from "../../../../utils/rate-limit";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";

async function checkDomain(req: NextApiRequest, res: NextApiResponse) {
  await apiRateLimiter(req, res);
  const { user } = await getSupabaseServerClient({ req, res });

  const { domain } = req.query;

  console.log("checkDomain", user?.id, `domain: ${domain}`);

  if (String(domain).endsWith("changes.page")) {
    return res.status(400).json({
      valid: false,
    });
  }

  const response = await fetch(
    `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  const valid = data?.configuredBy ? true : false;

  res.status(200).json({
    valid,
  });
}

export default checkDomain;
