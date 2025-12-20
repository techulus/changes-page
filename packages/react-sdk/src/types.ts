import type { ReactNode } from "react";
import type { Post, PostTag } from "@changespage/core";

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
  publicationDate: string | null;
  url: string;
}

export interface ChangelogPostProps {
  post: Post;
  children: (props: ChangelogPostRenderProps) => ReactNode;
}
