import { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";

async function addDomain(req: NextApiRequest, res: NextApiResponse) {
  const { user } = await getSupabaseServerClient({ req, res });

  const { domain } = req.body;

  if (domain.endsWith("changes.page")) {
    return res.status(400).json({
      success: false,
      error: "forbidden",
    });
  }

  console.log("addDomain", user?.id, `domain: ${domain}`);

  const response = await fetch(
    `https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      body: `{\n  "name": "${domain}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  const data = await response.json();

  if (data.error?.code == "forbidden") {
    // domain is already owned by another team but you can request delegation to access it
    res.status(200).json({
      success: false,
      error: "forbidden",
    });
  } else if (data.error?.code == "domain_taken") {
    // domain is already being used by a different project
    res.status(200).json({
      success: false,
      error: "domain_taken",
    });
  } else {
    // domain is successfully added
    res.status(200).json({
      success: true,
    });
  }
}

export default addDomain;
