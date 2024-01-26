import { OpenAIStream, OpenAIStreamPayload } from "../../../utils/open-ai";
import { rateLimiter } from "../../../utils/rate-limit";

export const config = {
  runtime: "edge",
};

const changeGpt = async (req: Request) => {
  const { content, addIntroOutro, soundCasual } = (await req.json()) as {
    content: string;
    addIntroOutro: boolean;
    soundCasual: boolean;
  };

  if (!content) {
    return new Response("No prompt in the request", { status: 400 });
  }

  if (!(await rateLimiter(req))) {
    return new Response("Too many requests", { status: 400 });
  }

  const prompt = `
Elaborate following commit messages / PR title / bullet points into a short content for a release note.

Use standard English, correct spelling and gramatical errors and feel free to rephrase.
${
  soundCasual
    ? "The content should sound casual."
    : "The content should sound formal."
}
${
  addIntroOutro
    ? "Add a short intro and outro, make sure its generic and polite."
    : "Do not add any introduction or additional content at the beginnning or end."
}

The content to process is:
"${content}".
`;

  const payload: OpenAIStreamPayload = {
    model: "gpt-4-1106-preview",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default changeGpt;
