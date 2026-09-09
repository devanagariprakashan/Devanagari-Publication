"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { fetchHomeReviews, HomeReview } from "@/lib/reviews";

// ponytail: rotating style palette per card (DB reviews carry no colors)
const CARD_STYLES = [
  { avatar: "from-rose-500 to-red-600", badge: "bg-red-50 text-[#C61821] border-red-200" },
  { avatar: "from-amber-500 to-orange-600", badge: "bg-amber-50 text-amber-800 border-amber-200" },
  { avatar: "from-indigo-600 to-blue-700", badge: "bg-blue-50 text-blue-800 border-blue-200" },
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<HomeReview[]>([]);

  useEffect(() => {
    let active = true;
    fetchHomeReviews(12).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, []);

  // Four copies → two identical halves → seamless -50% marquee loop
  const infiniteCards = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section
      id="testimonials"
      className="relative py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FFFDFD] via-[#FFF6F6]/50 to-white border-t border-red-100/60 overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-12 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-rose-100/30 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-[#C61821] border border-red-200/80 text-[10px] sm:text-[12px] font-bold uppercase tracking-wider shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C61821] animate-pulse" />
            <span>• Testimonials •</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 font-serif leading-tight mb-4">
            Loved by Readers{" "}
            <span className="relative inline-block text-[#C61821]">
              Across India
              <svg
                className="absolute -bottom-2 left-0 w-full h-2.5 text-[#C61821]/30"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,15 Q50,0 100,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Social Proof Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-800">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9 / 5.0 Rating</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Reviews</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-800">
              <GraduationCap className="w-4 h-4 text-[#C61821]" />
              <span>50,000+ Students &amp; Mentors</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTINUOUS INFINITE SMOOTH FLOW (Fast Marquee Stream)                     */}
        {/* ========================================================================= */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Left and Right Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFFDFD] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFFDFD] to-transparent z-10 pointer-events-none" />

          {/* Seamless Double Loop */}
          <div className="flex animate-marquee-infinite hover:[animation-play-state:paused] gap-6 items-stretch">
            {infiniteCards.map((r, idx) => {
              const st = CARD_STYLES[idx % CARD_STYLES.length];
              return (
                <div
                  key={`${r.id}-${idx}`}
                  className="w-[340px] sm:w-[420px] shrink-0 bg-white rounded-[5px] p-6 sm:p-7 border border-red-100/80 shadow-md shadow-red-950/5 hover:border-red-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.badge}`}
                      >
                        Verified Review
                      </span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.round(r.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-[16px] sm:text-[17px] font-serif text-gray-900 leading-snug mb-3">
                      &ldquo;{r.comment}&rdquo;
                    </blockquote>
                  </div>

                  {/* Footer Author Details */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${st.avatar} text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {r.reviewer_name
                        .split(" ")
                        .filter((n) => !n.includes("("))
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {r.reviewer_name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-[#C61821] font-medium truncate">
                        {r.book_title ? `on ${r.book_title}` : "Verified Buyer"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
            <span>💡 Hover over any review card to pause sliding</span>
          </p>
        </div>
      </div>
    </section>
  );
}
