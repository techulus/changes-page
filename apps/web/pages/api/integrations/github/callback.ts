import type { NextApiRequest, NextApiResponse } from "next";

function getSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function isValidInstallationId(value: string | undefined): boolean {
  if (!value) return false;
  if (value.length > 20) return false;
  return /^\d+$/.test(value);
}

function isValidCode(value: string | undefined): boolean {
  if (!value) return false;
  if (value.length > 100) return false;
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const setup_action = getSingleValue(req.query.setup_action);
  const installation_id = getSingleValue(req.query.installation_id);
  const code = getSingleValue(req.query.code);

  if (setup_action === "install" && isValidInstallationId(installation_id)) {
    const params = new URLSearchParams();
    params.set("installation_id", installation_id!);

    if (isValidCode(code)) {
      params.set("code", code!);
    }

    return res.redirect(`/integrations/github/setup?${params.toString()}`);
  }

  return res.redirect("/pages");
}
