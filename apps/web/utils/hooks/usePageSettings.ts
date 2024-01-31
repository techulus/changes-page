import { IPageSettings } from "@changes-page/supabase/types/page";
import { useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../../components/core/toast.component";
import { track } from "../analytics";
import { httpGet } from "../http";
import { useUserData } from "../useUser";

export default function usePageSettings(pageId: string, prefetch = true) {
  const { supabase } = useUserData();
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<IPageSettings>(null);

  async function updatePageSettings(payload) {
    try {
      const { data: settings } = await supabase
        .from("page_settings")
        .update(payload)
        .match({ page_id: pageId })
        .select();

      if (settings.length) {
        setSettings(settings[0]);
      }

      track("UpdatePageSettings");

      notifySuccess("Page updated!");
    } catch (e) {
      console.error(e);
      notifyError("Failed to update page settings");
    }
  }

  useEffect(() => {
    if (!pageId || !prefetch) return;

    httpGet({
      url: `/api/pages/settings?page_id=${pageId}`,
    }).then((settings) => {
      if (settings) setSettings(settings as IPageSettings);

      setLoading(false);

      return null;
    });
  }, [pageId, prefetch]);

  return {
    loading,
    // Settings
    settings,
    updatePageSettings,
  };
}
