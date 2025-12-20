export {
  createChangesPageClient,
  formatDate,
  getTagLabel,
  parseDate,
} from "@changespage/core";
export type {
  ChangesPageClient,
  ClientConfig,
  GetPostsOptions,
  GetPostsResult,
  Post,
  PostTag,
} from "@changespage/core";

export { ChangelogPost } from "./components";
export { usePosts } from "./hooks";
export type { ChangelogPostProps, ChangelogPostRenderProps } from "./types";
export type {
  UsePostsInitialData,
  UsePostsOptions,
  UsePostsResult,
} from "./hooks";
