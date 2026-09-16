import HeroBannerForm from "@/components/admin/HeroBannerForm";
import { getPageContent } from "@/lib/page-content";
import { pageTitle } from "@/components/admin/ui";

export default async function Page() {
  const content = await getPageContent("hero");
  return <div className="space-y-6">
    <h1 className={pageTitle}>Hero Banner</h1>
    <p className="text-sm text-stone-600">Replace the homepage hero background image. Upload a wide image or paste a URL, then save changes.</p>
    <HeroBannerForm initial={content.settings.bannerImage} />
  </div>;
}
