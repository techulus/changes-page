import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { runWorkflow } from "../../../utils/manageprompt";
import { getSupabaseServerClientForAPI } from "../../../utils/supabase/supabase-admin";

const suggestTitle = async (
  req: NextApiRequest,
  res: NextApiResponse<string[] | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      await getSupabaseServerClientForAPI({ req, res });

      const result = await runWorkflow("wf_e1eb79b1dc017ca189506d799453caae", {
        content,
      });

      const titles = JSON.parse(result);

      return res.status(200).json(titles);
    } catch (err) {
      console.log("suggestTitle", err?.response?.data || err?.message);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default suggestTitle;
