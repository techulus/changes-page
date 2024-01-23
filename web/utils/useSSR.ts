import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function getPage(supabase: SupabaseClient, id: string) {
  const { data: page } = await supabase
    .from("pages")
    .select("id,title,type,description,url_slug")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();

  return page;
}
