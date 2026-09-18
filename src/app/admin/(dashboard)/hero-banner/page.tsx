import Link from "next/link";
import HeroBannerForm from "@/components/admin/HeroBannerForm";
import { getPageContent } from "@/lib/page-content";
import { pageTitle } from "@/components/admin/ui";

export default async function Page() {
  const content = await getPageContent("hero");
  return <div className="space-y-6">
    <h1 className={pageTitle}>Hero Banner</h1>
    <p className="text-sm text-stone-600">Edit the homepage hero image and text. Upload a wide image or paste a URL, update the copy, then save changes.</p>
    <p className="text-sm text-stone-600">The 4 stat numbers below the banner (10+, 25K+, etc.) are edited separately on the <Link href="/admin/settings" className="font-medium text-brand-600 hover:underline">Settings</Link> page, under &quot;Homepage Stats&quot;.</p>
    <HeroBannerForm initial={content.settings} />
  </div>;
}
