import type { NextApiRequest, NextApiResponse } from "next";
import { clearVisitorAuthCookie } from "../../../lib/visitor-auth";

interface ApiResponse {
  success: boolean;
  message: string;
}

export default async function logoutVisitor(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Clear the authentication cookie
    clearVisitorAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("logoutVisitor error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}