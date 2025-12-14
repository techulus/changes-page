import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { installation_id, setup_action, code } = req.query;

  if (setup_action === "install" && installation_id) {
    if (code) {
      return res.redirect(
        `/integrations/github/setup?installation_id=${installation_id}&code=${code}`
      );
    }
    return res.redirect(
      `/integrations/github/setup?installation_id=${installation_id}`
    );
  }

  return res.redirect("/pages");
}
