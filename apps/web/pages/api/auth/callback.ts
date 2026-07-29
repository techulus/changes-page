import { NextApiHandler } from "next";
import { ROUTES } from "../../../data/routes.data";
import { createServerClientForAPI } from "../../../utils/supabase/server";

const callback: NextApiHandler = async (req, res) => {
  const code = req.query.code;
  const redirectedFrom = req.query.redirectedFrom;

  if (typeof code !== "string") {
    const error =
      typeof req.query.error_description === "string"
        ? req.query.error_description
        : "Missing or invalid code";
    return res.redirect(`/login?error=${encodeURIComponent(error)}`);
  }

  const supabase = createServerClientForAPI({ req, res });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
      console.error("Auth callback: No session created");
      return res.redirect(
        `/login?error=${encodeURIComponent("No session created")}`,
      );
    }
  } catch (err) {
    console.error("Auth callback exception:", err);
    return res.redirect(
      `/login?error=${encodeURIComponent("Authentication failed")}`,
    );
  }

  const redirectTo =
    typeof redirectedFrom === "string" &&
    Object.values(ROUTES).includes(redirectedFrom)
      ? redirectedFrom
      : ROUTES.PAGES;

  res.redirect(redirectTo);
};

export default callback;
