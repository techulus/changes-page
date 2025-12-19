import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@changespage/supabase/types";

export async function getPage(supabase: SupabaseClient<Database>, id: string) {
  const { data: page } = await supabase
    .from("pages")
    .select("id,title,type,description,url_slug,user_id")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();

  return page;
}
