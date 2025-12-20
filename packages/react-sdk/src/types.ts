import type { ReactNode } from "react";
import type { PostTag } from "@changespage/core";

export type {
  ChangesPageClient,
  ClientConfig,
  GetPostsOptions,
  GetPostsResult,
  Post,
  PostTag,
} from "@changespage/core";

export interface ChangelogPostRenderProps {
  id: string;
  title: string;
  content: string;
  plainText: string;
  tags: PostTag[];
  date: Date | null;
  formattedDate: string;
  url: string;
}

export interface ChangelogPostProps {
  post: import("@changespage/core").Post;
  locale?: string;
  children: (props: ChangelogPostRenderProps) => ReactNode;
}
