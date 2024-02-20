import { httpPost } from "./http";

export async function promptSuggestTitle(content: string): Promise<string[]> {
  return await httpPost({
    url: `/api/ai/suggest-title`,
    data: {
      content,
    },
  });
}

export async function getStreamingUrl(
  workflowId: string
): Promise<{ url: string }> {
  return await httpPost({
    url: `/api/ai/get-streaming-url`,
    data: {
      workflowId,
    },
  });
}
