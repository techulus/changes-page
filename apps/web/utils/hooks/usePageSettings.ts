import { IPageSettings } from "@changes-page/supabase/types/page";
import { useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../../components/core/toast.component";
import { httpGet } from "../http";
import { useUserData } from "../useUser";
import { createAuditLog } from "../auditLog";

export default function usePageSettings(pageId: string, prefetch = true) {
  const { supabase, user } = useUserData();
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<IPageSettings>(null);

  async function updatePageSettings(payload) {
    try {
      const { data: settings } = await supabase
        .from("page_settings")
        .update(payload)
        .match({ page_id: pageId })
        .select();

      await createAuditLog(supabase, {
        page_id: pageId,
        actor_id: user.id,
        action: "Updated Page Settings",
        changes: payload,
      });

      if (settings.length) {
        setSettings(settings[0]);
      }

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
