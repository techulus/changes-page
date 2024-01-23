import { NextApiRequest, NextApiResponse } from "next";

/**
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ revalidated: boolean } | { message: string } | string>
) {
  const { secret } = req.query;
  const { path } = req.body;

  // Check for secret to confirm this is a valid request
  if (secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!path) {
    return res.status(401).json({ message: "Invalid path" });
  }

  console.log("got revalidate request for", path);

  try {
    await res.revalidate(`/_sites/${path}/`);

    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.log("[page] Error revalidating", err);
    return res.status(500).send("Error revalidating");
  }
}
