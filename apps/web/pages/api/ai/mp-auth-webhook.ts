import { IErrorResponse } from "@changes-page/supabase/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

const managePromptAuthWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; ttl: number } | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { workflowId } = req.body;

    if (workflowId === process.env.MANAGEPROMPT_CHANGEGPT_WORKFLOW_ID) {
      res.status(200).json({ success: true, ttl: 86400 });
      return;
    }

    res.status(401).json({
      error: {
        statusCode: 401,
        message: "Invalid workflowId",
      },
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default managePromptAuthWebhook;
