import { NextRequest, NextResponse } from "next/server";
import { translateHostToPageIdentifier } from "./lib/data";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /badges (inside /public) for assets
     * 4. /v1 badges (inside /public) for widgets
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|badges/|v1/|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * Refer: https://github.com/vercel/platforms
 */
export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host");

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const pathname = url.pathname;
  const query = url.searchParams;

  // support revalidation
  if (pathname.startsWith(`/_sites`)) {
    return NextResponse.rewrite(url);
  }

  // redirect to user page based on hostname
  const { domain, page: url_slug } = translateHostToPageIdentifier(
    String(hostname)
  );

  const redirectUrl = new URL(
    `/_sites/${url_slug || domain}${pathname}${query ? `?${query}` : ""}`,
    req.url
  );

  return NextResponse.rewrite(redirectUrl);
}
