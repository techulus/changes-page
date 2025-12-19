import type { ReactNode } from "react";

export type PostTag = "fix" | "new" | "improvement" | "announcement" | "alert";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: PostTag[];
  publication_date: string | null;
  updated_at: string;
  created_at: string;
  url: string;
  plain_text_content: string;
}

export interface ClientConfig {
  baseUrl: string;
}

export interface GetPostsOptions {
  limit?: number;
  offset?: number;
}

export interface GetPostsResult {
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

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
  post: Post;
  children: (props: ChangelogPostRenderProps) => ReactNode;
}

export interface ChangesPageClient {
  getPosts: (options?: GetPostsOptions) => Promise<GetPostsResult>;
  getLatestPost: () => Promise<Post | null>;
}
