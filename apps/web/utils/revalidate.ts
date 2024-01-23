import { httpPost } from "./helpers";

export const revalidatePage = async (path: string) => {
  const revalidateEndpoint =
    process.env.REVALIDATE_ENDPOINT || "https://hey.changes.page";

  const result = await httpPost({
    url: `${revalidateEndpoint}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}`,
    data: { path },
  });

  console.log("revalidatePage: Result:", path, result);
};
