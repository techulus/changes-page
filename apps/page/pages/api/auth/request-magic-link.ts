import { supabaseAdmin } from "@changespage/supabase/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import {
  fetchRenderData,
  translateHostToPageIdentifier,
} from "../../../lib/data";
import {
  generateVerificationToken,
  getTokenExpiry,
} from "../../../lib/visitor-auth";
import inngestClient from "../../../utils/inngest";

const RATE_LIMIT_MINUTES = 2;

interface RequestBody {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

export default async function requestMagicLink(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { email }: RequestBody = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  try {
    const hostname = String(req?.headers?.host || "");
    const { domain, page: url_slug } = translateHostToPageIdentifier(hostname);

    let pageUrl: string | null = null;
    let pageId: string | null = null;

    try {
      const { page, settings } = await fetchRenderData(
        String(domain || url_slug)
      );
      if (page && settings) {
        pageId = page.id;
        if (settings.custom_domain) {
          pageUrl = `https://${settings.custom_domain}`;
        } else {
          pageUrl = `https://${page.url_slug}.changes.page`;
        }
      }
    } catch (pageError) {
      console.warn("Could not fetch page context for magic link:", pageError);
    }

    if (!pageUrl || !pageId) {
      return res.status(400).json({
        success: false,
        message: "Could not determine page context. Please contact support.",
      });
    }

    const { data: existingVisitor } = await supabaseAdmin
      .from("page_visitors")
      .select("id, verification_expires_at")
      .eq("email", email.toLowerCase())
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingVisitor?.verification_expires_at) {
      const lastRequestTime = new Date(existingVisitor.verification_expires_at);
      const timeSinceLastRequest =
        Date.now() - (lastRequestTime.getTime() - 15 * 60 * 1000);

      if (timeSinceLastRequest < RATE_LIMIT_MINUTES * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message: `Please wait before requesting another magic link`,
        });
      }
    }

    const verificationToken = generateVerificationToken();
    const expiresAt = getTokenExpiry();

    const existingVisitorId = req.cookies.cp_pa_vid;
    let visitorId: string | undefined;
    if (existingVisitor) {
      visitorId = existingVisitor.id;
    } else if (existingVisitorId) {
      const { data: idTaken } = await supabaseAdmin
        .from("page_visitors")
        .select("id")
        .eq("id", existingVisitorId)
        .maybeSingle();

      if (!idTaken) {
        visitorId = existingVisitorId;
      }
    }

    const { error: upsertError } = await supabaseAdmin
      .from("page_visitors")
      .upsert(
        {
          ...(visitorId && { id: visitorId }),
          email: email.toLowerCase(),
          verification_token: verificationToken,
          verification_expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: "email",
        }
      );

    if (upsertError) {
      console.error("Failed to upsert page_visitor:", upsertError);
      return res.status(500).json({
        success: false,
        message: "Failed to process request",
      });
    }

    await inngestClient.send({
      name: "email/visitor.magic-link",
      data: {
        email: email.toLowerCase(),
        verification_token: verificationToken,
        page_url: pageUrl,
        page_id: pageId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Magic link sent! Please check your email.",
    });
  } catch (error: any) {
    console.error("requestMagicLink error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
