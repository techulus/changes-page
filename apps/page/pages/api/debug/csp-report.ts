import { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";

class CspViolationError extends Error {
  payload: unknown;

  constructor(payload: unknown) {
    super("CSP Violation Report");
    this.name = "CSPViolationError";
    this.payload = payload;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    console.error("CSP Violation: ", body);
    Sentry.captureException(new CspViolationError(body));
    res.status(200).end();
  } catch (err) {
    res.status(200).end();
  }
}
