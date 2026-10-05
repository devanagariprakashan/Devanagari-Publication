import PageContentForm from "@/components/admin/PageContentForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getPageContent } from "@/lib/page-content";
import { WhatsNewVisibilityToggle } from "@/components/admin/WhatsNewVisibilityToggle";
import { createClient } from "@/lib/supabase/server";
import { SITE_DEFAULTS } from "@/lib/site-settings";

export default async function Page() {
  const content = await getPageContent("hero");
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("whats_new_enabled").eq("id", 1).maybeSingle();
  const siteSettings = { ...SITE_DEFAULTS, ...(settings ?? {}) };
  return <div className="space-y-6">
    <PageHeader
      title="Hero Section"
      description="The moving book carousel on the homepage. Add, edit, remove or reorder books, then save. Pick the linked product for each slide so its cover opens the right product page. An optional cover image replaces the illustrated cover."
    />
    <WhatsNewVisibilityToggle enabled={siteSettings.whats_new_enabled} />
    <PageContentForm kind="hero" initial={content} />
  </div>;
}
