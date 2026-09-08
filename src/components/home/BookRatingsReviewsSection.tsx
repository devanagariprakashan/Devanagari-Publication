"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  { name: "Aman Verma", role: "MPPSC Aspirant", text: "Very helpful for MPPSC preparation. Content is precise and well structured.", verified: true },
  { name: "Priya Singh", role: "State Service Aspirant", text: "Best book for Hindi grammar. Easy language and good examples.", verified: true },
  { name: "Rohit Patidar", role: "MPPSC Aspirant", text: "Updated edition is really useful. Highly recommended!", verified: true },
  { name: "Neha Agarwal", role: "UPSC Aspirant", text: "Clarity of writing is unmatched, highly recommended for prelims.", verified: true },
  { name: "Sushma Tripathi", role: "Senior Teacher", text: "Rigorously edited and beautifully produced.", verified: true },
];

export default function BookRatingsReviewsSection() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const total = Math.ceil(REVIEWS.length / perPage);
  const visible = REVIEWS.slice(page * perPage, page * perPage + perPage);
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
          <button onClick={() => setPage((p) => (p > 0 ? p - 1 : total - 1))} aria-label="Prev" className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center z-10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setPage((p) => (p < total - 1 ? p + 1 : 0))} aria-label="Next" className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center z-10">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r) => (
              <div key={r.name} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5">
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-xs font-bold">{r.name.split(" ").map((n) => n[0]).join("").slice(0,2)}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1">{r.name} {r.verified && <span className="w-3.5 h-3.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[8px]">✓</span>}</div>
                    <div className="text-xs text-gray-500">{r.role}</div>
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
