import { useEffect, useState } from "react";
import { notifyError } from "../../components/core/toast.component";
import { IPage } from "@changespage/supabase/types/page";
import { useUserData } from "../useUser";

export default function usePage(pageId: string, prefetch = true) {
  const { supabase } = useUserData();
  const [loading, setLoading] = useState(false);

  const [page, setPage] =
    useState<Pick<IPage, "id" | "title" | "type" | "description" | "url_slug">>(
      null
    );

  useEffect(() => {
    if (!pageId || !prefetch) return;

    setLoading(true);

    const getPage = supabase
      .from("pages")
      .select("id,title,type,description,url_slug")
      .eq("id", String(pageId))
      .single();

    getPage.then((page) => {
      if (page.error) {
        notifyError();
      }

      setPage(page?.data || null);

      setLoading(false);

      return null;
    });
  }, [pageId]);

  return {
    loading,
    // Page
    page,
  };
}
