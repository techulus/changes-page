import { IPost } from "@changespage/supabase/types/page";

export type IPublicPost = Omit<IPost, "user_id" | "page_id" | "images_folder" | "email_notified">;

export const POST_SELECT_FIELDS =
  "id, title, content, tags, status, notes, allow_reactions, publish_at, publication_date, created_at, updated_at";
