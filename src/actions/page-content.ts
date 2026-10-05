"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { contentSchemas, type PageKind } from "@/lib/page-content-shared";
import { getPageContent } from "@/lib/page-content";

const FIELD_LABELS: Record<string, string> = {
  title: "Title", name: "Name", id: "ID", category: "Category", excerpt: "Excerpt", content: "Full article", author: "Author",
  authorRole: "Author role", readTime: "Read time", date: "Date", imageBg: "Banner colour", role: "Role", dept: "Department",
  experience: "Experience", qualification: "Qualification", bio: "Biography", gradient: "Banner colour", image: "Image",
  price: "Price", originalPrice: "Original price", rating: "Rating", reviewsCount: "Reviews count", bgColor: "Cover background",
  coverType: "Cover artwork", subject: "Subject",
};

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// An article's id is its URL (/blog/<id>). The editor creates a random id for a new article; turn that into a
// readable address from the title, and keep it unique. Existing articles keep the id they already have.
function withArticleSlugs(raw: unknown): unknown {
  const data = raw as { items?: Record<string, unknown>[] } | null;
  if (!data || !Array.isArray(data.items)) return raw;
  const used = new Set(data.items.map(item => String(item.id ?? "")).filter(id => id && !UUID_LIKE.test(id)));
  const items = data.items.map(item => {
    const id = String(item.id ?? "");
    if (id && !UUID_LIKE.test(id)) return item;
    const title = String(item.title ?? "").trim();
    if (!title) return item; // validation reports the missing title
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "article";
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return { ...item, id: slug };
  });
  return { ...data, items };
}

export async function savePageContent(kind: PageKind, raw: string): Promise<{ error?: string; success?: string; itemIndex?: number }> {
  if (kind !== "team" && kind !== "blog" && kind !== "hero") return { error: "Invalid page" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in as an admin" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin access required" };
  let parsedRaw: unknown;
  try { parsedRaw = JSON.parse(raw); }
  catch { return { error: "Could not read the submitted content." }; }
  if (kind === "blog") parsedRaw = withArticleSlugs(parsedRaw);
  const result = contentSchemas[kind].safeParse(parsedRaw);
  if (!result.success) {
    const issue = result.error.issues[0];
    // issue.path looks like ["items", 4, "rating"] — surface it as "Item 5: rating — <reason>"
    // so the admin can find the exact entry to fix instead of guessing across all of them.
    const [section, index, field] = issue.path;
    if (section === "items" && typeof index === "number") {
      const entry = kind === "team" ? "Member" : kind === "blog" ? "Article" : "Book";
      const fieldName = field ? FIELD_LABELS[String(field)] ?? String(field) : "";
      // Zod's "Too small: expected string to have >=1 characters" just means the field was left empty.
      const reason = issue.code === "too_small" && field ? `${fieldName} is required` : fieldName ? `${fieldName}: ${issue.message}` : issue.message;
      return { error: `${entry} ${index + 1}: ${reason}`, itemIndex: index };
    }
    return { error: `${issue.path.join(".") || "Form"} — ${issue.message}` };
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
