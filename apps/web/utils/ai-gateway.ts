import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
