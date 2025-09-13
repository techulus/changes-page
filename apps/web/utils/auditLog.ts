import { SupabaseClient } from "@supabase/supabase-js";

interface AuditLogEntry {
  page_id: string;
  actor_id: string;
  action: string;
  changes?: Record<string, any>;
}

export async function createAuditLog(
  supabase: SupabaseClient,
  entry: AuditLogEntry
) {
  try {
    const { error } = await supabase.from("page_audit_logs").insert(entry);
    
    if (error) {
      console.error("Failed to create audit log:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
}