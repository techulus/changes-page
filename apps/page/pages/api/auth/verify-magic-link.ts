import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@changes-page/supabase/admin";
import { createVisitorJWT, setVisitorAuthCookie, isTokenExpired } from "../../../lib/visitor-auth";

interface RequestBody {
  token: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  visitor?: {
    id: string;
    email: string;
    email_verified: boolean;
  };
  error?: string;
}

export default async function verifyMagicLink(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { token }: RequestBody = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Verification token is required",
    });
  }

  try {
    // Find visitor by verification token
    const { data: visitor, error: fetchError } = await supabaseAdmin
      .from("page_visitors")
      .select("*")
      .eq("verification_token", token)
      .maybeSingle();

    if (fetchError) {
      console.error("Failed to fetch visitor:", fetchError);
      return res.status(500).json({
        success: false,
        message: "Failed to verify token",
        error: fetchError.message,
      });
    }

    if (!visitor) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Check if token is expired
    if (isTokenExpired(visitor.verification_expires_at)) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired. Please request a new magic link.",
      });
    }

    // Mark email as verified and clear verification token
    const { data: updatedVisitor, error: updateError } = await supabaseAdmin
      .from("page_visitors")
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires_at: null,
      })
      .eq("id", visitor.id)
      .select()
      .single();

    if (updateError || !updatedVisitor) {
      console.error("Failed to update visitor:", updateError);
      return res.status(500).json({
        success: false,
        message: "Failed to verify email",
        error: updateError?.message,
      });
    }

    // Create JWT token
    const jwtToken = await createVisitorJWT(updatedVisitor);

    // Set auth cookie and visitor ID cookie
    setVisitorAuthCookie(res, jwtToken);

    // Also set the legacy visitor ID cookie to match the authenticated visitor ID
    res.setHeader("Set-Cookie", [
      `cp_visitor_token=${jwtToken}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
      `cp_pa_vid=${updatedVisitor.id}; Path=/; Secure; SameSite=Lax; Max-Age=${365 * 24 * 60 * 60}`
    ]);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      visitor: {
        id: updatedVisitor.id,
        email: updatedVisitor.email,
        email_verified: updatedVisitor.email_verified,
      },
    });
  } catch (error: any) {
    console.error("verifyMagicLink error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}