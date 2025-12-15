import { streamText } from "ai";
import { openRouter } from "../../../utils/ai-gateway";
import { withAuth } from "../../../utils/withAuth";

const expandConcept = withAuth(async (req, res) => {
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
        prompt: `You are a changelog writer. Take the following concept or brief description and expand it into a well-written changelog entry. Keep it concise but informative. Use markdown formatting where appropriate. Return only the expanded content without any explanations.

Concept:
${content}`,
      });

      result.pipeTextStreamToResponse(res);
    } catch (err) {
      console.error("expandConcept error:", {
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

export default expandConcept;
