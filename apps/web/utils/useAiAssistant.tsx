import { httpPost } from "./helpers";

export async function promptSuggestTitle(content: string): Promise<string[]> {
  return await httpPost({
    url: `/api/ai/suggest-title`,
    data: {
      content,
    },
  });
}

export async function expandConcept(content: string): Promise<string> {
  return await httpPost({
    url: `/api/ai/expand-concept`,
    data: {
      content,
    },
  });
}
