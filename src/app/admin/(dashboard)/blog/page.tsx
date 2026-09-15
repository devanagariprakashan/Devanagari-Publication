import PageContentForm from "@/components/admin/PageContentForm";
import { getPageContent } from "@/lib/page-content";
import { pageTitle } from "@/components/admin/ui";
export default async function Page() {
 const content = await getPageContent("blog");
 return <div className="space-y-6"><h1 className={pageTitle}>Blog</h1><PageContentForm kind="blog" initial={{ settings: content.settings, items: content.items.map(item => ({ ...item })) }} /></div>;
}
