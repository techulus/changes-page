import type { Database, Tables } from "./index";

export type IPage = Tables<"pages">;
export type IPageSettings = Tables<"page_settings">;
export type IPost = Tables<"posts">;
export type IPageEmailSubscriber = Tables<"page_email_subscribers">;
export type IPageView = Tables<"page_views">;
export type IPageVisitor = Tables<"page_visitors">;
export type ITeam = Tables<"teams">;
export type ITeamMember = Tables<"team_members">;
export type ITeamInvitation = Tables<"team_invitations">;
export type IRoadmapBoard = Tables<"roadmap_boards">;
export type IRoadmapColumn = Tables<"roadmap_columns">;
export type IRoadmapCategory = Tables<"roadmap_categories">;
export type IRoadmapItem = Tables<"roadmap_items">;
export type IRoadmapVote = Tables<"roadmap_votes">;

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
