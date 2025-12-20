import type { PostTag } from "./types";

const tagLabels: Record<PostTag, string> = {
  fix: "Fix",
  new: "New",
  improvement: "Improvement",
  announcement: "Announcement",
  alert: "Alert",
};

export function getTagLabel(tag: PostTag): string {
  return tagLabels[tag] ?? tag;
}
