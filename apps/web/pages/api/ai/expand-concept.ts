import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";

const expandConcept = async (
  req: NextApiRequest,
  res: NextApiResponse<string | IErrorResponse>
) => {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      await getSupabaseServerClient({ req, res });

      const openai = new OpenAIApi(
        new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        })
      );

      const { data } = await openai.createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "user",
            content: `Elaborate these bullet points into short content (avoid exceeding more than 50 words per point) for a product changelog post: "${content}". Please provide just the content without title or formatting. The purpose of this content is to provide updates about a product to its users.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log("OpenAI -> ", data.choices);

      if (!data.choices.length) {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: "No result found",
          },
        });
      }

      return res.status(200).json(data.choices[0].message.content.trim());
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
