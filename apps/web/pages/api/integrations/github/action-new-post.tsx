import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { IErrorResponse } from "../../../../data/api.interface";
import { IPost } from "../../../../data/page.interface";
import {
  createPost,
  getPageByIntegrationSecret,
} from "../../../../utils/useDatabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pick<IPost, "id"> | null | IErrorResponse>
) {
  const {
    body: { title, type, content, status },
  } = req;
  const page_secret_key = req.headers["page-secret-key"];

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

    res.status(200).json({
      id: data.id,
    });
  } catch (e: Error | any) {
    console.error("[Github]: action-new-post error", e);
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}
