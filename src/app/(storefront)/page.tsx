import { getPageContent } from "@/lib/page-content";
import type { BookData, BookCoverType } from "@/data/heroContent";
import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/components/home/HomeContent";
import { FeaturedCategory } from "@/components/home/FeaturedCategories";
import { BestsellerBook } from "@/components/home/BestsellersSection";
import { HandpickedBook } from "@/components/home/HandpickedSection";
import { SITE_DEFAULTS, heroStatsFromSettings, type SiteSettings } from "@/lib/site-settings";
import type { Database } from "@/types/database";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  books?: { count: number }[];
};



type RatingSummary = { average: number; count: number };

function buildRatingMap(reviews: { book_id: string | null; rating: number | null }[]): Map<string, RatingSummary> {
  const totals = new Map<string, { sum: number; count: number }>();
  for (const review of reviews) {
    if (!review.book_id) continue;
    const entry = totals.get(review.book_id) ?? { sum: 0, count: 0 };
    entry.sum += review.rating ?? 0;
    entry.count += 1;
    totals.set(review.book_id, entry);
  }
  const ratingMap = new Map<string, RatingSummary>();
  for (const [bookId, { sum, count }] of totals) {
    ratingMap.set(bookId, { average: sum / count, count });
  }
  return ratingMap;
}

// Cycled backdrop colors for books an admin flags "Show on Homepage Banner" — they don't get the
// hand-picked styling a Hero Section slide does, just a real cover photo over one of these.
const HERO_BG_PALETTE = [
  "from-[#8B151B] via-[#A81820] to-[#5C0A0E]",
  "from-[#084C38] via-[#0E6248] to-[#04281E]",
  "from-[#0F2B5C] via-[#1A3F82] to-[#081836]",
  "from-[#78350F] via-[#9A3412] to-[#451A03]",
  "from-[#4C1D95] via-[#6B21A8] to-[#2E1065]",
];

function toHeroBook(b: BookRow, ratingMap: Map<string, RatingSummary>, index: number): BookData {
  const summary = ratingMap.get(String(b.id));
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    subject: b.exam ?? "",
    category: b.exam ?? b.category_id ?? "",
    price: Number(b.price ?? 0),
    originalPrice: Number(b.original_price ?? b.price ?? 0),
    rating: summary?.average ?? 0,
    reviewsCount: summary?.count ?? 0,
    coverType: "hindi",
    bgColor: HERO_BG_PALETTE[index % HERO_BG_PALETTE.length],
    edition: b.edition ?? undefined,
    badge: b.badge ?? undefined,
    author: b.author ?? undefined,
    image: b.image_url ?? undefined,
  };
}

// Real average/count from approved customer reviews, not the admin-entered rating/reviews_count columns.
function toBestseller(b: BookRow, ratingMap: Map<string, RatingSummary>): BestsellerBook {
  const summary = ratingMap.get(String(b.id));
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    author: b.author ?? "Devanagari Publications",
    category: b.exam ?? b.category_id ?? "",
    subject: b.exam ?? undefined,
    price: b.price ?? 0,
    originalPrice: b.original_price ?? b.price ?? 0,
    discountPercent: b.discount_percent ?? 0,
    rating: summary?.average ?? 0,
    reviewsCount: summary?.count ?? 0,
    badge: b.badge ?? undefined,
    image: b.image_url ?? "/images/books/image-2.png",
    edition: b.edition ?? undefined,
  };
}

function toHandpicked(b: BookRow, ratingMap: Map<string, RatingSummary>): HandpickedBook {
  const summary = ratingMap.get(String(b.id));
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    author: b.author ?? "Devanagari Publications",
    examCategory: b.exam ?? b.category_id ?? "",
    subject: b.exam ?? "",
    category: b.exam ?? b.category_id ?? "",
    price: b.price ?? 0,
    originalPrice: b.original_price ?? b.price ?? 0,
    discountPercent: b.discount_percent ?? 0,
    rating: summary?.average ?? 0,
    reviewsCount: summary?.count ?? 0,
    badge: b.badge ?? undefined,
    image: b.image_url ?? "/images/books/image-2.png",
    edition: b.edition ?? undefined,
  };
}

export default async function Home() {
  const supabase = await createClient();
  const hero = await getPageContent("hero");
  const curatedHeroBooks: BookData[] = hero.items.map(item => ({
    ...item, id: item.id, title: item.title, subject: item.subject, category: item.category, bgColor: item.bgColor,
    coverType: item.coverType as BookCoverType, price: Number(item.price), originalPrice: Number(item.originalPrice),
    rating: Number(item.rating), reviewsCount: Number(item.reviewsCount),
  }));

  const [categoriesRes, bestsellersRes, handpickedRes, heroFlaggedRes, siteSettingsRes, reviewsRes] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id,name,slug,image_url,books(count)")
        .eq("is_active", true)
        .order("created_at"),
      supabase
        .from("books")
        .select("*")
        .eq("is_bestseller", true)
        .eq("is_active", true)
        .order("id")
        .limit(10),
      supabase
        .from("books")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("id")
        .limit(10),
      supabase
        .from("books")
        .select("*")
        .eq("show_in_hero", true)
        .eq("is_active", true)
        .order("id")
        .limit(10),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("reviews").select("book_id, rating").eq("is_approved", true),
    ]);

  const categories: FeaturedCategory[] = (categoriesRes.data ?? []).map(
    (c: CategoryRow) => ({
      id: c.id,
      name: c.name,
      count: c.books?.[0]?.count ?? 0,
      slug: c.slug ?? undefined,
    }),
  );

  const ratingMap = buildRatingMap(reviewsRes.data ?? []);
  const bestsellers = (bestsellersRes.data ?? []).map((b) => toBestseller(b, ratingMap));
  const handpicked = (handpickedRes.data ?? []).map((b) => toHandpicked(b, ratingMap));
  const siteSettings: SiteSettings = { ...SITE_DEFAULTS, ...(siteSettingsRes.data ?? {}) };
  const heroStats = heroStatsFromSettings(siteSettings);

  // Books an admin flags "Show on Homepage Banner" append to the hand-curated Hero Section
  // slides — skipping any book a curated slide already links to, so it isn't shown twice.
  const curatedIds = new Set(curatedHeroBooks.map((item) => String(item.id)));
  const flaggedHeroBooks = (heroFlaggedRes.data ?? [])
    .filter((b) => !curatedIds.has(String(b.id)))
    .map((b, i) => toHeroBook(b, ratingMap, i));
  const heroBooks: BookData[] = [...curatedHeroBooks, ...flaggedHeroBooks];

  return (
    <HomeContent
      heroBooks={heroBooks}
      heroBannerImage={hero.settings.bannerImage}
      heroStats={heroStats}
      heroText={hero.settings}
      categories={categories}
      bestsellers={bestsellers}
      handpicked={handpicked}
      whatsNewEnabled={siteSettings.whats_new_enabled}
    />
  );
}
