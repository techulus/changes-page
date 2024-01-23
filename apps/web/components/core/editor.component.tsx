import fileExtension from "file-extension";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { v4 } from "uuid";
import { useUserData } from "../../utils/useUser";
import { notifyError } from "./toast.component";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function MarkdownEditor({
  imagesFolderPrefix,
  value,
  onChange,
}) {
  const { supabase } = useUserData();

  const onUploadImage = useCallback(
    async (
      file: File,
      onSuccess: (url: string) => void,
      onError: (error: string) => void
    ) => {
      try {
        if (!imagesFolderPrefix) {
          throw new Error("Images folder prefix is missing");
        }

        const fileKey = `${imagesFolderPrefix}/${v4()}.${fileExtension(
          file.name
        )}`;

        await supabase.storage.from("images").upload(fileKey, file);

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileKey);

        return onSuccess(publicUrl);
      } catch (e) {
        console.error(e);
        notifyError();
        onError(e);
      }
    },
    [imagesFolderPrefix]
  );

  const options = useMemo(() => {
    return {
      spellChecker: false,
      uploadImage: true,
      imageUploadFunction: onUploadImage,
      placeholder: "### Content",
    };
  }, [imagesFolderPrefix]);

  return <SimpleMDE options={options} value={value} onChange={onChange} />;
}
