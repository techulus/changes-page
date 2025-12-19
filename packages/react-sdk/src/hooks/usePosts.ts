"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChangesPageClient, Post } from "../types";

export interface UsePostsInitialData {
  posts: Post[];
  hasMore: boolean;
}

export interface UsePostsOptions {
  client: ChangesPageClient;
  initialData?: UsePostsInitialData;
  limit?: number;
}

export interface UsePostsResult {
  posts: Post[];
  hasMore: boolean;
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
}

export function usePosts({
  client,
  initialData,
  limit = 10,
}: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>(initialData?.posts ?? []);
  const [hasMore, setHasMore] = useState(initialData?.hasMore ?? true);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  const didFetch = useRef(!!initialData);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    let cancelled = false;

    async function fetchInitial() {
      try {
        const result = await client.getPosts({ limit, offset: 0 });
        if (!cancelled) {
          setPosts(result.posts);
          setHasMore(result.hasMore);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInitial();

    return () => {
      cancelled = true;
    };
  }, [client, limit]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await client.getPosts({
        limit,
        offset: posts.length,
      });
      setPosts((prev) => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [client, posts.length, limit, loading, hasMore]);

  return {
    posts,
    hasMore,
    loading,
    error,
    loadMore,
  };
}
