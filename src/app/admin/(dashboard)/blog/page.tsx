import PageContentForm from "@/components/admin/PageContentForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("blog");
  return <div className="space-y-6">
    <PageHeader
      title="Blog"
      description="Articles shown on the Blog page. Write, edit or reorder posts, then save to publish the changes."
    />
    <PageContentForm kind="blog" initial={{ settings: content.settings, items: content.items.map(item => ({ ...item })) }} />
  </div>;
}
