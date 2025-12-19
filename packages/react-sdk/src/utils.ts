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

export function formatDate(
  dateString: string | null,
  locale: string = "en-US"
): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}
