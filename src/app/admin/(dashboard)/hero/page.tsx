import PageContentForm from "@/components/admin/PageContentForm";
import { getPageContent } from "@/lib/page-content";
import { pageTitle } from "@/components/admin/ui";

export default async function Page() {
  const content = await getPageContent("hero");
  return <div className="space-y-6">
    <h1 className={pageTitle}>Hero Section</h1>
    <p className="text-sm text-stone-600">Manage the moving book carousel on the homepage. Add, edit, remove, or reorder books, then save changes. Use the product ID from Books to link each cover to its product page. An optional cover image replaces the illustrated cover.</p>
    <PageContentForm kind="hero" initial={content} />
  </div>;
}
