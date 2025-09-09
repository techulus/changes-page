import { IPost, PostStatus } from "@changes-page/supabase/types/page";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useUserData } from "../useUser";

const PAGINATION_LIMIT = 5;

export default function usePagePosts(
  pageId: string,
  search = "",
  pinnedPostId: string = null
) {
  const { supabase } = useUserData();
  const router = useRouter();
  const { status } = router.query ?? {};

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [allowLoadMore, setAllowLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search_value] = useDebounce(search, 500);
  const [pinnedPost, setPinnedPost] = useState<IPost>(null);

  function fetchPosts(offset = 0) {
    setAllowLoadMore(false);

    if (!offset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("page_id", String(pageId))
      .order("publication_date", { ascending: false })
      .range(0 + offset, PAGINATION_LIMIT - 1 + offset);

    if (status) {
      query = query.eq("status", status as PostStatus);
    }

    if (pinnedPostId && !status) {
      query = query.neq("id", String(pinnedPostId));
    }

    if (search_value) {
      query = query.textSearch("content", search_value, {
        config: "english",
      });
    }

    return query.then((result) => {
      if (!offset) {
        setPosts(result?.data || []);
      } else {
        setPosts((posts) => [...posts, ...result?.data]);
      }
      setLoading(false);
      setLoadingMore(false);
      setPostsCount(result?.count);

      return result;
    });
  }

  useEffect(() => {
    setAllowLoadMore(posts.length !== postsCount);
  }, [posts, postsCount]);

  useEffect(() => {
    if (!pageId) return;

    fetchPosts();
  }, [status, search_value, pageId, pinnedPostId]);

  useEffect(() => {
    if (pinnedPostId && !status) {
      supabase
        .from("posts")
        .select("*")
        .eq("id", String(pinnedPostId))
        .single()
        .then(({ data }) => setPinnedPost(data));
    } else {
      setPinnedPost(null);
    }
  }, [pinnedPostId, status]);

  return {
    loading,
    // Posts
    posts,
    pinnedPost,
    allowLoadMore,
    loadingMore,
    fetchPosts,
    // Search
    search_value,
  };
}
