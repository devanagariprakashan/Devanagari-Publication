"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { contentSchemas, type PageKind } from "@/lib/page-content-shared";

export async function savePageContent(kind: PageKind, raw: string): Promise<{ error?: string; success?: string }> {
  if (kind !== "team" && kind !== "blog" && kind !== "hero") return { error: "Invalid page" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in as an admin" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin access required" };
  let content;
  try { content = contentSchemas[kind].parse(JSON.parse(raw)); }
  catch { return { error: "Check required fields, unique IDs, numeric values, and URLs." }; }
  const { error } = await supabase.from("page_content").upsert({ slug: kind, content }, { onConflict: "slug" });
  if (error) return { error: error.message };
  revalidatePath(kind === "hero" ? "/" : `/${kind}`);
  revalidatePath(`/admin/${kind}`);
  return { success: "Changes saved" };
}
