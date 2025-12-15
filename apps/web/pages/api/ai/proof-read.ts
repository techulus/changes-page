import { streamText } from "ai";
import { openRouter } from "../../../utils/ai-gateway";
import { withAuth } from "../../../utils/withAuth";

const proofRead = withAuth(async (req, res) => {
  if (req.method === "POST") {
    const { prompt: content } = req.body;

    try {
      if (!content?.trim()) {
        throw "Content is missing";
      }

      const result = streamText({
        model: openRouter("openai/gpt-5-mini"),
        headers: {
          "HTTP-Referer": "https://changes.page",
          "X-Title": "Changes.Page",
        },
        prompt: `Proofread and improve the following changelog content. Fix any grammar, spelling, or clarity issues while maintaining the original meaning and tone. Return only the improved text without any explanations.

Content:
${content}`,
      });

      result.pipeTextStreamToResponse(res);
    } catch (err) {
      console.error("proofRead error:", {
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
});

export default proofRead;
