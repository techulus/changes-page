import type { Database } from "./index";

export type IPage = Database["public"]["Tables"]["pages"]["Row"];
export type IPageSettings =
  Database["public"]["Tables"]["page_settings"]["Row"];
export type IPost = Database["public"]["Tables"]["posts"]["Row"];
export type IPageEmailSubscriber =
  Database["public"]["Tables"]["page_email_subscribers"]["Row"];
export type IPageView = Database["public"]["Tables"]["page_views"]["Row"];
export type ITeam = Database["public"]["Tables"]["teams"]["Row"];
export type ITeamMember = Database["public"]["Tables"]["team_members"]["Row"];
export type ITeamInvitation =
  Database["public"]["Tables"]["team_invitations"]["Row"];
export type IRoadmapBoard =
  Database["public"]["Tables"]["roadmap_boards"]["Row"];
export type IRoadmapColumn =
  Database["public"]["Tables"]["roadmap_columns"]["Row"];
export type IRoadmapCategory =
  Database["public"]["Tables"]["roadmap_categories"]["Row"];
export type IRoadmapItem = Database["public"]["Tables"]["roadmap_items"]["Row"];

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
  fix: "Fixes",
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

export type IReactions = {
  thumbs_up?: number;
  thumbs_down?: number;
  rocket?: number;
  sad?: number;
  heart?: number;
};
