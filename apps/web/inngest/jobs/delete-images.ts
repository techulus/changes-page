import { supabaseAdmin } from "@changes-page/supabase/admin";
import inngestClient from "../../utils/inngest";

export const DELETE_IMAGES_JOB_EVENT = "job/storage.delete_in_path";

const BUCKET_NAME = "images";

export async function deleteFolderContents(folderPath: string) {
  // List all objects in the current folder
  let { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(folderPath, { limit: 100, offset: 0 });

  if (error) {
    console.error("Error listing objects:", error);
    return;
  }

  const files = [];
  const subdirectories = [];

  for (const item of data) {
    if (item.id) {
      files.push(item.name);
    } else {
      subdirectories.push(item.name);
    }
  }

  // Recursively delete contents of subdirectories
  for (const item of subdirectories) {
    await deleteFolderContents(`${folderPath}/${item}`);
  }

  // Delete all files in the current directory
  if (files.length > 0) {
    const filesToRemove = files.map((x) => `${folderPath}/${x}`);
    console.log(DELETE_IMAGES_JOB_EVENT, "Deleting files:", filesToRemove);

    const { error: deleteError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove(filesToRemove);

    if (deleteError) {
      console.error(
        DELETE_IMAGES_JOB_EVENT,
        "Error deleting files:",
        deleteError
      );
    } else {
      console.log(
        DELETE_IMAGES_JOB_EVENT,
        `Files in ${folderPath} deleted successfully`
      );
    }
  }
}

export const deleteImagesJob = inngestClient.createFunction(
  { name: "Jobs: Delete images in path" },
  { event: DELETE_IMAGES_JOB_EVENT },
  async ({ event }) => {
    const { path } = event.data;

    console.log("Job started: Deleting images", {
      path,
    });

    await deleteFolderContents(path);

    return { body: "Job completed" };
  }
);
