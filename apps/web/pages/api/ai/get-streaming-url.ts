import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { createSignedStreamingUrl } from "../../../utils/manageprompt";
import { getSupabaseServerClientForAPI } from "../../../utils/supabase/supabase-admin";

const expandConcept = async (
  req: NextApiRequest,
  res: NextApiResponse<{ url: string } | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { workflowId } = req.body;
    try {
      await getSupabaseServerClientForAPI({ req, res });

      const url = await createSignedStreamingUrl(workflowId);

      return res.status(200).json({ url });
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
