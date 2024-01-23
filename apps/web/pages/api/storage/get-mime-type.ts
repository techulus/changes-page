import mime from "mime-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse } from "../../../data/api.interface";

const getMimeType = async (
  req: NextApiRequest,
  res: NextApiResponse<string | IErrorResponse>
) => {
  if (req.method === "POST") {
    try {
      const { fileKey } = req.body;
      const result = mime.lookup(fileKey);

      return res.status(200).json(result);
    } catch (err) {
      console.log("getMimeType", err?.response?.data || err?.message);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default getMimeType;
