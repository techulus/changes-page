import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { runWorkflow } from "../../../utils/manageprompt";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";

const expandConcept = async (
  req: NextApiRequest,
  res: NextApiResponse<string | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      await getSupabaseServerClient({ req, res });

      const result = await runWorkflow("wf_0075a2a911339f610bcfc404051cce3e", {
        content,
      });

      return res.status(200).json(result);
    } catch (err) {
      console.log("expandConcept", err?.response?.data || err?.message);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default expandConcept;
