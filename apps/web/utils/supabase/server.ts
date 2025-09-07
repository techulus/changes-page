import { Database } from "@changes-page/supabase/types";
import { createServerClient } from "@supabase/ssr";

export function createServerClientSSR(context: { req: any; res: any }) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(context.req.cookies).map((name) => ({
            name,
            value: context.req.cookies[name],
          }));
        },
        setAll(cookiesToSet) {
          const cookieStrings = cookiesToSet.map(({ name, value, options }) => {
            const cookieOptions = {
              path: "/",
              httpOnly: false, // Allow client-side access for supabase-js
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
              ...options,
            };

            return `${name}=${value}; Path=${cookieOptions.path}; ${
              cookieOptions.httpOnly ? "HttpOnly;" : ""
            } ${cookieOptions.secure ? "Secure;" : ""} SameSite=${
              cookieOptions.sameSite
            };${
              cookieOptions.maxAge ? ` Max-Age=${cookieOptions.maxAge};` : ""
            }`;
          });

          // Get existing cookies and add the new ones
          const existingCookies = context.res.getHeader("Set-Cookie") || [];
          const existingCookieArray = Array.isArray(existingCookies)
            ? existingCookies
            : [existingCookies].filter(Boolean);

          context.res.setHeader("Set-Cookie", [
            ...existingCookieArray,
            ...cookieStrings,
          ]);
        },
      },
    }
  );
}
