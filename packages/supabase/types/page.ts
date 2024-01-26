import type { Database } from "./index";

export type IPage = Database["public"]["Tables"]["pages"]["Row"];
export type IPageSettings =
  Database["public"]["Tables"]["page_settings"]["Row"];
export type IPost = Database["public"]["Tables"]["posts"]["Row"];
export type IPageEmailSubscriber =
  Database["public"]["Tables"]["page_email_subscribers"]["Row"];
export type IPageView = Database["public"]["Tables"]["page_views"]["Row"];

export enum PageType {
  changelogs = "changelogs",
  updates = "updates",
  releases = "releases",
  announcements = "announcements",
}

export enum PostStatus {
  draft = "draft",
  publish_later = "publish_later",
  published = "published",
  archived = "archived",
}

export enum PostType {
  fix = "fix",
  new = "new",
  improvement = "improvement",
  announcement = "announcement",
  alert = "alert",
}

export const PageTypeToLabel: {
  [key in Database["public"]["Enums"]["page_type"]]: string;
} = {
  changelogs: "Changelog",
  updates: "Updates",
  releases: "Releases",
  announcements: "Announcements",
};

export const PostTypeToLabel: {
  [key in Database["public"]["Enums"]["post_type"]]: string;
} = {
  fix: "Bug fix",
  new: "New",
  improvement: "Improvement",
  announcement: "Announcement",
  alert: "Alert",
};

export const PostStatusToLabel: {
  [key in Database["public"]["Enums"]["post_status"]]: string;
} = {
  draft: "Draft",
  publish_later: "Scheduled",
  published: "Published",
  archived: "Archived",
};

export const tagColors = ["red", "amber", "teal", "sky", "pink"];

export const URL_SLUG_REGEX = new RegExp("^[a-zA-Z0-9]([w-]*[a-zA-Z0-9])*$");
