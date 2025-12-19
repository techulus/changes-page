import type {
  ChangesPageClient,
  ClientConfig,
  GetPostsOptions,
  GetPostsResult,
  Post,
} from "./types";

interface ApiResponse {
  posts: Post[];
  totalCount: number;
}

const API_VERSION = "2";

export function createChangesPageClient(config: ClientConfig): ChangesPageClient {
  const baseUrl = config.baseUrl.replace(/\/$/, "");

  async function getPosts(options?: GetPostsOptions): Promise<GetPostsResult> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(`${baseUrl}/api/json?${params.toString()}`, {
      headers: {
        "X-API-Version": API_VERSION,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { error?: string }).error || response.statusText;
      throw new Error(errorMessage);
    }

    const data: ApiResponse = await response.json();

    return {
      posts: data.posts,
      totalCount: data.totalCount,
      hasMore: offset + data.posts.length < data.totalCount,
    };
  }

  async function getLatestPost(): Promise<Post | null> {
    const result = await getPosts({ limit: 1 });
    return result.posts[0] ?? null;
  }

  return {
    getPosts,
    getLatestPost,
  };
}
