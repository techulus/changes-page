import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedVisitor } from "../../../lib/visitor-auth";

interface ApiResponse {
  success: boolean;
  visitor?: {
    id: string;
    email: string;
    email_verified: boolean;
  };
  message?: string;
}

export default async function getVisitorProfile(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const visitor = await getAuthenticatedVisitor(req);

    if (!visitor) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      visitor: {
        id: visitor.id,
        email: visitor.email,
        email_verified: visitor.email_verified,
      },
    });
  } catch (error: any) {
    console.error("getVisitorProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}