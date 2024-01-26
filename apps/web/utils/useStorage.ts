import { httpPost } from "./helpers";
import { useUserData } from "./useUser";

export default function useStorage() {
  const { supabase } = useUserData();

  async function uploadFile(fileKey, fileContent): Promise<string> {
    // because mime type library is too big for client
    const contentType = await httpPost({
      url: "/api/storage/get-mime-type",
      data: { fileKey },
    });

    await supabase.storage.from("images").upload(fileKey, fileContent, {
      contentType,
    });

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileKey);

    return publicUrl;
  }

  async function deleteFileFromUrl(url) {
    if (!url) throw "Invalid URL";

    const fileKey = url.split("images")[1].substring(1);
    await supabase.storage.from("images").remove([fileKey]);
  }

  return {
    uploadFile,
    deleteFileFromUrl,
  };
}
