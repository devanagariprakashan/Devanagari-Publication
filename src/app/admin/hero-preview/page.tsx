import HeroSection from "@/components/home/HeroSection";

export default async function HeroPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ image?: string }>;
}) {
  const { image } = await searchParams;
  return (
    <div className="h-screen overflow-hidden">
      <HeroSection bannerImage={image || undefined} />
    </div>
  );
}
