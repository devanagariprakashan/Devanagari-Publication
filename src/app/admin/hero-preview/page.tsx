import HeroSection from "@/components/home/HeroSection";

type PreviewParams = {
  image?: string;
  badgeText?: string;
  editionBadge?: string;
  headingLine1?: string;
  headingHighlight?: string;
  headingLine3?: string;
  description?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
};

export default async function HeroPreviewPage({
  searchParams,
}: {
  searchParams: Promise<PreviewParams>;
}) {
  const {
    image,
    badgeText,
    editionBadge,
    headingLine1,
    headingHighlight,
    headingLine3,
    description,
    ctaPrimaryLabel,
    ctaSecondaryLabel,
  } = await searchParams;
  return (
    <div className="h-screen overflow-hidden">
      <HeroSection
        bannerImage={image || undefined}
        badgeText={badgeText || undefined}
        editionBadge={editionBadge || undefined}
        headingLine1={headingLine1 || undefined}
        headingHighlight={headingHighlight || undefined}
        headingLine3={headingLine3 || undefined}
        description={description || undefined}
        ctaPrimaryLabel={ctaPrimaryLabel || undefined}
        ctaSecondaryLabel={ctaSecondaryLabel || undefined}
      />
    </div>
  );
}
