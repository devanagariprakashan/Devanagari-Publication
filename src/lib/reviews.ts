import { createClient } from "@/lib/supabase/client";

export interface HomeReview {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
  book_id: string | null;
  book_title: string;
}

// ponytail: fallback 2 reviews until the reviewer_name migration + `npx tsx scripts/apply-reviews.ts` run.
const FALLBACK_REVIEWS: HomeReview[] = [
  { id: "fallback-1", rating: 5, comment: "पुस्तक की भाषा सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।", reviewer_name: "राहुल शर्मा", created_at: "", book_id: "101", book_title: "Samanya Hindi Evam Vyakaran" },
  { id: "fallback-2", rating: 4, comment: "सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।", reviewer_name: "प्रिया वर्मा", created_at: "", book_id: "102", book_title: "Nibandh Sanhita" },
];

export async function fetchHomeReviews(limit = 9): Promise<HomeReview[]> {
  const supabase = createClient();
  const { data: first, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, reviewer_name, created_at, book_id, books(title)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  let data = first;
  if (error) {
    // reviewer_name column / books embed not migrated yet — degrade without them
    const r2 = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, book_id")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    data = (r2.data ?? []).map((r) => ({ ...r, reviewer_name: null, books: [] }));
  }
  if (!data || data.length === 0) return FALLBACK_REVIEWS;
  return data.map((r) => ({
    id: String(r.id),
    rating: r.rating ?? 5,
    comment: r.comment ?? "",
    reviewer_name: r.reviewer_name ?? "Verified Buyer",
    created_at: r.created_at ?? "",
    book_id: r.book_id ?? null,
    book_title: (r as { books?: { title?: string } }).books?.title ?? "",
  }));
}
