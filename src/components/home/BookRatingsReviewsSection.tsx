"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchHomeReviews, HomeReview } from "@/lib/reviews";

export default function BookRatingsReviewsSection() {
  const [reviews, setReviews] = useState<HomeReview[]>([]);
  const [page, setPage] = useState(0);
  const perPage = 3;

  useEffect(() => {
    let active = true;
    fetchHomeReviews(9).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, []);

  const total = Math.max(1, Math.ceil(reviews.length / perPage));
  const visible = reviews.slice(page * perPage, page * perPage + perPage);
  // ponytail: simple pagination, no infinite carousel lib; add swipe when needed
  return (
    <section className="py-8 sm:py-10 bg-white border-t border-gray-50">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
            <span className="text-gray-900">Book Ratings & Reviews</span>
            <span className="text-[#C61821] text-lg">📌</span>
            <span className="bg-red-50 text-[#C61821] border border-red-100 text-xs font-bold px-2.5 py-0.5 rounded-full">Top</span>
          </h2>
          <Link href="/#testimonials" className="hidden sm:inline-flex text-sm font-bold text-[#C61821] gap-1 items-center shrink-0">View All Reviews <span>→</span></Link>
        </div>
        <div className="relative">
          <button onClick={() => setPage((p) => (p > 0 ? p - 1 : total - 1))} aria-label="Prev" className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center z-10 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setPage((p) => (p < total - 1 ? p + 1 : 0))} aria-label="Next" className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center z-10 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 flex flex-col">
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(r.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">&ldquo;{r.comment}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-xs font-bold">{r.reviewer_name.slice(0, 2)}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1">{r.reviewer_name} <span className="w-3.5 h-3.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[8px]">✓</span></div>
                    {r.book_id && r.book_title ? (
                      <Link href={`/product/${r.book_id}`} className="text-xs text-[#C61821] hover:underline truncate block">{r.book_title}</Link>
                    ) : (
                      <div className="text-xs text-gray-500">Verified Buyer</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-[#C61821]" : "w-1.5 bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
