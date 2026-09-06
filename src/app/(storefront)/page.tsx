import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/components/home/HomeContent";
import { FeaturedCategory } from "@/components/home/FeaturedCategories";
import { BestsellerBook } from "@/components/home/BestsellersSection";
import { HandpickedBook } from "@/components/home/HandpickedSection";
import { AuthorItem } from "@/components/home/TopAuthorsSection";
import type { Database } from "@/types/database";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];
type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  books?: { count: number }[];
};

const FALLBACK_GRADIENTS = [
  "from-red-500 to-amber-600",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-700",
  "from-purple-600 to-indigo-700",
  "from-amber-600 to-orange-700",
  "from-slate-700 to-slate-900",
];

function toBestseller(b: BookRow): BestsellerBook {
  return {
    id: Number(b.id),
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    author: b.author ?? "Devanagari Publications",
    category: b.exam ?? b.category_id ?? "",
    subject: b.exam ?? undefined,
    price: b.price ?? 0,
    originalPrice: b.original_price ?? b.price ?? 0,
    discountPercent: b.discount_percent ?? 0,
    rating: b.rating ?? 0,
    reviewsCount: b.reviews_count ?? 0,
    badge: b.badge ?? undefined,
    image: b.image_url ?? "/images/books/image-2.png",
    edition: b.edition ?? undefined,
  };
}

function toHandpicked(b: BookRow): HandpickedBook {
  return {
    id: Number(b.id),
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    author: b.author ?? "Devanagari Publications",
    examCategory: b.exam ?? b.category_id ?? "",
    subject: b.exam ?? "",
    category: b.exam ?? b.category_id ?? "",
    price: b.price ?? 0,
    originalPrice: b.original_price ?? b.price ?? 0,
    discountPercent: b.discount_percent ?? 0,
    rating: b.rating ?? 0,
    reviewsCount: b.reviews_count ?? 0,
    badge: b.badge ?? undefined,
    image: b.image_url ?? "/images/books/image-2.png",
    edition: b.edition ?? undefined,
  };
}

export default async function Home() {
  const supabase = await createClient();

  const [categoriesRes, bestsellersRes, handpickedRes, authorsRes] =
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
        .limit(8),
      supabase.from("authors").select("*").eq("is_active", true),
    ]);

  const categories: FeaturedCategory[] = (categoriesRes.data ?? []).map(
    (c: CategoryRow) => ({
      id: c.id,
      name: c.name,
      count: c.books?.[0]?.count ?? 0,
      slug: c.slug ?? undefined,
    }),
  );

  const bestsellers = (bestsellersRes.data ?? []).map(toBestseller);
  const handpicked = (handpickedRes.data ?? []).map(toHandpicked);

  const authors: AuthorItem[] = [];
  const authorRows = authorsRes.data ?? [];
  for (let i = 0; i < authorRows.length; i++) {
    const a: AuthorRow = authorRows[i];
    const { data: authorBooks } = await supabase
      .from("books")
      .select("*")
      .eq("author", a.name)
      .eq("is_active", true)
      .order("id")
      .limit(4);

    authors.push({
      id: a.id,
      name: a.name,
      role: a.role ?? "",
      shortRole: a.short_role ?? a.role ?? "",
      category: "all",
      booksCount: (authorBooks ?? []).length,
      image: a.image_url ?? "/images/authors/default-author.jpg",
      fallbackGradient: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
      experience: "",
      bio: a.bio ?? "",
      books: (authorBooks ?? []).map((b: BookRow) => ({
        id: Number(b.id),
        title: b.title,
        category: b.exam ?? b.category_id ?? "",
        price: b.price ?? 0,
        image: b.image_url ?? "/images/books/image-2.png",
      })),
    });
  }

  return (
    <HomeContent
      categories={categories}
      bestsellers={bestsellers}
      handpicked={handpicked}
      authors={authors}
    />
  );
}
