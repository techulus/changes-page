import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";
import { ROUTES } from "../../../data/routes.data";
import { Database } from "@changes-page/supabase/types";

const callback: NextApiHandler = async (req, res) => {
  const code = req.query.code;
  const redirectedFrom = req.query.redirectedFrom;

  if (typeof code === "string") {
    const supabase = createPagesServerClient<Database>({ req, res });
    await supabase.auth.exchangeCodeForSession(code);
  }

  res.redirect(redirectedFrom ? `${redirectedFrom}` : ROUTES.PAGES);
};

export default callback;
