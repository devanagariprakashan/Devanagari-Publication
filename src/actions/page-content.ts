"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { contentSchemas, type PageKind } from "@/lib/page-content-shared";
import { getPageContent } from "@/lib/page-content";

export async function savePageContent(kind: PageKind, raw: string): Promise<{ error?: string; success?: string }> {
  if (kind !== "team" && kind !== "blog" && kind !== "hero") return { error: "Invalid page" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in as an admin" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin access required" };
  let parsedRaw: unknown;
  try { parsedRaw = JSON.parse(raw); }
  catch { return { error: "Could not read the submitted content." }; }
  const result = contentSchemas[kind].safeParse(parsedRaw);
  if (!result.success) {
    const issue = result.error.issues[0];
    // issue.path looks like ["items", 4, "rating"] — surface it as "Item 5: rating — <reason>"
    // so the admin can find the exact entry to fix instead of guessing across all of them.
    const [section, index, field] = issue.path;
    const location =
      section === "items" && typeof index === "number"
        ? `Item ${index + 1}${field ? `: ${String(field)}` : ""}`
        : issue.path.join(".") || "Form";
    return { error: `${location} — ${issue.message}` };
  }
  const content = result.data;
  const { error } = await supabase.from("page_content").upsert({ slug: kind, content }, { onConflict: "slug" });
  if (error) return { error: error.message };
  revalidatePath(kind === "hero" ? "/" : `/${kind}`);
  revalidatePath(`/admin/${kind}`);
  return { success: "Changes saved" };
}

export async function saveHeroBanner(settings: Record<string, string>): Promise<{ error?: string; success?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in as an admin" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin access required" };
  const current = await getPageContent("hero");
  const parsed = contentSchemas.hero.safeParse({ ...current, settings: { ...current.settings, ...settings } });
  if (!parsed.success) return { error: "Check the banner fields: image must be a site path or HTTP(S) URL." };
  const { error } = await supabase.from("page_content").upsert({ slug: "hero", content: parsed.data }, { onConflict: "slug" });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/hero-banner");
  return { success: "Banner saved" };
}
