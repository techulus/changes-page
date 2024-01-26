import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { IErrorResponse } from "@changes-page/supabase/types/api";
import { getSupabaseServerClient } from "../../../utils/supabase/supabase-admin";

const suggestTitle = async (
  req: NextApiRequest,
  res: NextApiResponse<string[] | IErrorResponse>
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
            content: `Suggest few titles for this post content as a JSON array of titles: "${content}".`,
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
            message: "No title suggestions found",
          },
        });
      }

      const titles = JSON.parse(
        data.choices[0].message.content
          .replaceAll("```json", "")
          .replaceAll("```", "")
          .trim()
      );

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
