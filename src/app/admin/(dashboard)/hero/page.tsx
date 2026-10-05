import PageContentForm from "@/components/admin/PageContentForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("hero");
  return <div className="space-y-6">
    <PageHeader
      title="Hero Section"
      description="The moving book carousel on the homepage. Add, edit, remove or reorder books, then save. Pick the linked product for each slide so its cover opens the right product page. An optional cover image replaces the illustrated cover."
    />
    <PageContentForm kind="hero" initial={content} />
  </div>;
}
