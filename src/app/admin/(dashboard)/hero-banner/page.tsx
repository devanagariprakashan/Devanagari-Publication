import Link from "next/link";
import { Info } from "lucide-react";
import HeroBannerForm from "@/components/admin/HeroBannerForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("hero");
  return <div className="space-y-6">
    <PageHeader
      title="Hero Banner"
      description="The image and text at the top of the homepage. Upload a desktop banner and, optionally, a 9:16 mobile banner, update the copy, then save."
    />
    <p className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 ring-1 ring-blue-100">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        The 4 stat numbers below the banner (10+, 25K+, etc.) are edited on the{" "}
        <Link href="/admin/settings" className="font-semibold underline">Settings</Link> page, under &quot;Homepage Stats&quot;.
      </span>
    </p>
    <HeroBannerForm initial={content.settings} />
  </div>;
}
