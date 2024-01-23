import { Database } from "@changes-page/supabase/types";

export type IPage = Database["public"]["Tables"]["pages"]["Row"];
export type IPageSettings =
  Database["public"]["Tables"]["page_settings"]["Row"];
export type IPost = Database["public"]["Tables"]["posts"]["Row"];
export type IPageEmailSubscriber =
  Database["public"]["Tables"]["page_email_subscribers"]["Row"];
export type IPageView = Database["public"]["Tables"]["page_views"]["Row"];
export type IPostReaction =
  Database["public"]["Tables"]["post_reactions"]["Row"];

export type IPageWithSettings = IPage & {
  page_settings: IPageSettings;
};

export enum PageType {
  changelogs = "changelogs",
  updates = "updates",
  releases = "releases",
  announcements = "announcements",
}

export enum PostType {
  fix = "fix",
  new = "new",
  improvement = "improvement",
  announcement = "announcement",
  alert = "alert",
}

export const PageTypeToLabel: { [key in PageType]: string } = {
  [PageType.changelogs]: "Changelog",
  [PageType.updates]: "Updates",
  [PageType.releases]: "Releases",
  [PageType.announcements]: "Announcements",
};

export const PostTypeToLabel: { [key in PostType]: string } = {
  [PostType.fix]: "Bug fix",
  [PostType.new]: "New",
  [PostType.improvement]: "Improvement",
  [PostType.announcement]: "Announcement",
  [PostType.alert]: "Alert",
};

export const tagColors = ["red", "amber", "teal", "sky", "pink"];
