import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPost } from "@changes-page/supabase/types/page";
import {
  createPost,
  getPageByIntegrationSecret,
} from "../../../../utils/useDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPost | null | IErrorResponse>
) {
  let {
    query: { page_secret_key },
    body: { title, type, content, status },
  } = req;

  if (!page_secret_key || !title || !type || !content || !status) {
    res
      .status(400)
      .json({ error: { statusCode: 400, message: "Invalid request" } });
  }

  try {
    const pageDetails = await getPageByIntegrationSecret(
      String(page_secret_key)
    );

    console.log("create posts for", pageDetails?.id, pageDetails?.title);

    const data = await createPost({
      user_id: pageDetails.user_id,
      page_id: pageDetails.id,
      title,
      content,
      type,
      status,
      images_folder: v4(),
    });

    res.status(200).json(data);
  } catch (e: Error | any) {
    console.error("Zapier action-new-post error", e);
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}
