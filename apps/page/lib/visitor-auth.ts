import { IPageVisitor } from "@changes-page/supabase/types/page";
import { SignJWT, jwtVerify } from "jose";
import type { NextApiRequest } from "next";
import { randomBytes, randomUUID } from "node:crypto";

if (!process.env.VISITOR_JWT_SECRET) {
  throw new Error("VISITOR_JWT_SECRET environment variable is required");
}

const JWT_SECRET = new TextEncoder().encode(process.env.VISITOR_JWT_SECRET);

export const JWT_COOKIE_NAME = "cp_visitor_token";
const JWT_EXPIRY = "30d";

export interface VisitorTokenPayload {
  visitor_id: string;
  email: string;
  email_verified: boolean;
  iat: number;
  exp: number;
}

export interface AuthenticatedVisitor {
  id: string;
  email: string;
  email_verified: boolean;
}

/**
 * Generate a secure verification token for magic links
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Create a JWT token for an authenticated visitor
 */
export async function createVisitorJWT(
  visitor: Pick<IPageVisitor, "id" | "email" | "email_verified">
): Promise<string> {
  const jwt = await new SignJWT({
    visitor_id: visitor.id,
    email: visitor.email,
    email_verified: visitor.email_verified,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);

  return jwt;
}

/**
 * Type guard to check if payload is a valid VisitorTokenPayload
 */
function isVisitorTokenPayload(payload: any): payload is VisitorTokenPayload {
  return (
    typeof payload.visitor_id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.email_verified === "boolean" &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number"
  );
}

/**
 * Verify and decode a visitor JWT token
 */
export async function verifyVisitorJWT(
  token: string
): Promise<VisitorTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (isVisitorTokenPayload(payload)) {
      return payload;
    } else {
      console.error("Invalid JWT payload structure");
      return null;
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Get authenticated visitor from request cookies
 */
export async function getAuthenticatedVisitor(
  req: NextApiRequest
): Promise<AuthenticatedVisitor | null> {
  const token = req.cookies[JWT_COOKIE_NAME];
  if (!token) {
    return null;
  }

  const payload = await verifyVisitorJWT(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.visitor_id,
    email: payload.email,
    email_verified: payload.email_verified,
  };
}

/**
 * Get visitor ID from either JWT token or legacy cookie
 * This maintains backward compatibility with existing visitor tracking
 */
export async function getVisitorId(req: NextApiRequest): Promise<string> {
  // First try to get from JWT token
  const authenticatedVisitor = await getAuthenticatedVisitor(req);
  if (authenticatedVisitor) {
    return authenticatedVisitor.id;
  }

  // Fall back to legacy cookie
  let visitorId = req.cookies.cp_pa_vid;

  if (!visitorId) {
    // Generate new visitor ID if none exists
    visitorId = randomUUID();
  }

  return visitorId;
}

/**
 * Check if a verification token is expired
 */
export function isTokenExpired(expiresAt: string | null): boolean {
  if (!expiresAt) {
    return true;
  }
  return new Date(expiresAt) < new Date();
}

/**
 * Generate verification token expiry time (15 minutes from now)
 */
export function getTokenExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
}
