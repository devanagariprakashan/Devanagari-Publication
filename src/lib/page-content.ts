import "server-only";
import { createClient } from "@/lib/supabase/server";
import { contentDefaults, contentSchemas, type PageKind } from "./page-content-shared";

export async function getPageContent<K extends PageKind>(kind: K): Promise<(typeof contentDefaults)[K]> {
  const supabase = await createClient();
  const { data } = await supabase.from("page_content").select("content").eq("slug", kind).maybeSingle();
  const parsed = contentSchemas[kind].safeParse(data?.content);
  return (parsed.success ? parsed.data : contentDefaults[kind]) as (typeof contentDefaults)[K];
}
