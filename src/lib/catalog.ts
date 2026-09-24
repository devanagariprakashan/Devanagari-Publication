import type { BookItem } from "@/data/booksData";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

const FALLBACK_FORMATS = ["Current Affairs", "Civil Judge", "General Knowledge", "MPPSC", "UPSC", "Literature", "Other"] as const;
const FALLBACK_LANGUAGES = ["Hindi", "Hindi-English Diglot", "English"] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

function normalizeFormat(value?: string | null): BookItem["format"] {
  return (value && FALLBACK_FORMATS.includes(value as BookItem["format"]))
    ? (value as BookItem["format"])
    : "Other";
}

function normalizeLanguage(value?: string | null): BookItem["language"] {
  return (value && FALLBACK_LANGUAGES.includes(value as BookItem["language"]))
    ? (value as BookItem["language"])
    : "Hindi";
}

export type RatingSummary = { average: number; count: number };

export function mapBookRowToItem(
  book: BookRow,
  categoryMap: Map<string, Pick<CategoryRow, "name" | "slug">> = new Map(),
  ratingMap: Map<string, RatingSummary> = new Map(),
): BookItem {
  const category = categoryMap.get(book.category_id ?? "") ?? null;
  const categoryName = category?.name ?? book.exam ?? "General";
  const categorySlug = category?.slug ?? slugify(categoryName);
  const examName = book.exam ?? categoryName;
  const ratingSummary = ratingMap.get(String(book.id));

  return {
    id: book.id,
    title: book.title,
    hindiTitle: book.hindi_title ?? undefined,
    subtitle: book.subtitle ?? undefined,
    author: book.author ?? "Devanagari Publications",
    category: categoryName,
    categorySlug,
    exam: examName,
    examSlug: slugify(examName),
    subject: examName,
    format: normalizeFormat(book.format),
    language: normalizeLanguage(book.language),
    price: Number(book.price ?? 0),
    originalPrice: Number(book.original_price ?? book.price ?? 0),
    discountPercent: Number(book.discount_percent ?? 0),
    // Real average/count from approved customer reviews, not an admin-entered number.
    rating: ratingSummary?.average ?? 0,
    reviewsCount: ratingSummary?.count ?? 0,
    badge: book.badge ?? undefined,
    badgeColor: book.badge_color ?? undefined,
    image: book.image_url ?? "/images/books/image-2.png",
    sampleImages: Array.isArray(book.images) ? book.images.map((value) => String(value)) : [],
    demoFileUrl: book.demo_file_url ?? undefined,
    demoVideoUrl: book.demo_video_url ?? undefined,
    edition: book.edition ?? "Latest Edition",
    inStock: book.in_stock ?? true,
    pages: book.pages ?? undefined,
    isbn: book.isbn ?? undefined,
    description: book.description ?? "A quality Devanagari publication.",
    highlights: Array.isArray(book.highlights)
      ? book.highlights.map((value) => String(value))
      : [],
    isBestseller: !!book.is_bestseller,
    isNewRelease: !!book.is_new_release,
    isFeatured: !!book.is_featured,
    publication: book.publication ?? undefined,
    binding: book.binding ?? undefined,
    shortSummary: book.description ?? undefined,
    featureHighlights: [
      { title: "Updated syllabus", subtitle: "Exam-focused content", icon: "sparkles" },
      { title: "Expert-curated", subtitle: "Built for competitive exam preparation", icon: "target" },
      { title: "High quality", subtitle: "Premium printing and student-first design", icon: "book" },
    ],
  };
}

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

export async function fetchCatalogBooks(): Promise<BookItem[]> {
  const supabase = createClient();

  const [booksRes, categoriesRes, reviewsRes] = await Promise.all([
    supabase.from("books").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name, slug").eq("is_active", true),
    supabase.from("reviews").select("book_id, rating").eq("is_approved", true),
  ]);

  const categories = (categoriesRes.data ?? []) as CategoryRow[];
  const categoryMap = new Map(categories.map((category) => [category.id, { name: category.name, slug: category.slug }]));
  const ratingMap = buildRatingMap(reviewsRes.data ?? []);

  const books = (booksRes.data ?? []) as BookRow[];
  return books.length > 0 ? books.map((book) => mapBookRowToItem(book, categoryMap, ratingMap)) : [];
}
