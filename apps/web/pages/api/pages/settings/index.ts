import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPageSettings } from "@changes-page/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "../../../../utils/supabase/supabase-admin";
import { createOrRetrievePageSettings } from "../../../../utils/useDatabase";

const getPageSettings = async (
  req: NextApiRequest,
  res: NextApiResponse<IPageSettings | IErrorResponse>
) => {
  if (req.method === "GET") {
    const { page_id } = req.query;

    try {
      const { user } = await getSupabaseServerClient({ req, res });

      console.log("getPageSettings", user?.id);

      const data = await createOrRetrievePageSettings(String(page_id));

      return res.status(200).json(data);
    } catch (err) {
      console.log("getPageSettings", err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default getPageSettings;
