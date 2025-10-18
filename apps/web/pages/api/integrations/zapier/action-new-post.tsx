import { IErrorResponse } from "@changes-page/supabase/types/api";
import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
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
    body: { title, tags, content, status },
  } = req;

  if (!page_secret_key || !title || !tags || !content || !status) {
    res
      .status(400)
      .json({ error: { statusCode: 400, message: "Invalid request" } });
  }

  try {
    const pageDetails = await getPageByIntegrationSecret(
      String(page_secret_key)
    );

    console.log(
      "Zapier: create posts for",
      pageDetails?.id,
      pageDetails?.title
    );

    const data = await createPost({
      user_id: pageDetails.user_id,
      page_id: pageDetails.id,
      title,
      content,
      tags,
      status,
      images_folder: v4(),
      publication_date:
        status === PostStatus.published ? new Date().toISOString() : null,
      notes: "",
      allow_reactions: false,
      email_notified: false,
    });

    res.status(200).json(data);
  } catch (e: unknown) {
    console.error("Zapier action-new-post error", e);
    res.status(500).json({ error: { statusCode: 500, message: e.message } });
  }
}
