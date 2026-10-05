import PageContentForm from "@/components/admin/PageContentForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("team");
  return <div className="space-y-6">
    <PageHeader
      title="Team"
      description="The people shown on the Team page. Add members, edit their details, reorder them, then save."
    />
    <PageContentForm kind="team" initial={{ settings: content.settings, items: content.items.map(item => ({ ...item })) }} />
  </div>;
}
