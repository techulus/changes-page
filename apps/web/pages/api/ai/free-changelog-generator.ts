import { streamText } from "ai";
import { NextApiRequest, NextApiResponse } from "next";
import { openRouter } from "../../../utils/ai-gateway";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt: content, intro, tone } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    try {
      const result = streamText({
        model: openRouter("openai/gpt-5-mini"),
        headers: {
          "HTTP-Referer": "https://changes.page",
          "X-Title": "Changes.Page",
        },
        system: `<instructions>
You are a changelog writer. Generate a well-formatted changelog based on the provided commit messages, PR titles, or bullet points.

Format the output as markdown with clear sections and bullet points.
Tone: ${tone === "casual" ? "Write in a casual, friendly tone" : "Write in a formal, professional tone"}
${intro === "Add a short intro and outro, make sure its generic and polite." ? "Include a brief intro and outro paragraph." : "Do not add any introduction or conclusion - just the changelog content."}

IMPORTANT: Never remove any images, image tags, or image URLs from the input. All images must be preserved exactly as they appear in the original content.
</instructions>`,
        prompt: `<input>
${content}
</input>`,
      });

      result.pipeTextStreamToResponse(res);
    } catch (err) {
      console.error("free-changelog-generator error:", {
        message: err?.message,
        cause: err?.cause,
        stack: err?.stack,
      });
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
