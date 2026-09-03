"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  Award,
  BookOpen,
  Calendar,
  Library,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import HeroBook3D, { HERO_BOOKS, BookData } from "./HeroBook3D";

interface HeroSectionProps {
  onSelectBook?: (book: BookData) => void;
  onExploreBooks?: () => void;
  onViewAuthors?: () => void;
}

export default function HeroSection({
  onSelectBook,
  onExploreBooks,
  onViewAuthors,
}: HeroSectionProps) {
  // Triple array for buttery seamless infinite continuous marquee loop
  const displayBooks = [...HERO_BOOKS, ...HERO_BOOKS, ...HERO_BOOKS];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F5] via-[#FFF9F9] to-[#FFFFFF] pt-4 sm:pt-6 pb-0">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[750px] h-[280px] bg-red-100/50 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-16 right-10 w-[280px] h-[280px] bg-orange-100/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* TOP HERO HEADINGS & CTA (Centered within 1450px Container) */}
      <div className="max-w-[1450px] mx-auto px-2 sm:px-4 lg:px-5 flex flex-col items-center">
        {/* 1. TOP PILL BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-red-100 shadow-2xs mb-2.5 sm:mb-3 text-xs sm:text-[13px] font-medium text-gray-700 backdrop-blur-2xs hover:border-red-200 transition-colors">
          <div className="w-4 h-4 rounded-full bg-[#C61821] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
          <span>India’s Trusted Publication for Competitive Exams</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#C61821] font-semibold bg-red-50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> 2025-26 Edition
          </span>
        </div>

        {/* 2. MAIN HERO HEADINGS (Compact & Punchy) */}
        <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-2.5">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#111827] font-bold tracking-tight !leading-[1.25]">
            India's Trusted
            <span className="text-[#C61821] font-serif font-bold">
              {" "}Publication{" "}
            </span>{" "}
            <br className="hidden sm:inline" />
            for Competitive Exams
          </h1>
        </div>

        {/* 3. HERO SUBTITLE */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            High-quality standard study material for{" "}
            <strong className="font-semibold text-[#C61821]">MPPSC</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">Judiciary</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">SI</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">
              Hindi Grammar
            </strong>{" "}
            & <strong className="font-semibold text-[#C61821]">Law</strong> —
            prepared by expert educators.
          </p>
        </div>

        
      </div>

      {/* 4. FULL-WIDTH MODERN 3D BOOKS AUTO-SCROLLING SHOWCASE (No Buttons, Clean, Edge-to-Edge) */}
      <div className="w-full relative overflow-hidden pt-2 sm:pt-3 pb-3 sm:pb-3">
        {/* Left & Right Soft Blur Edge Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#FFF5F5] via-[#FFF5F5]/85 to-transparent z-30 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#FFFFFF] via-[#FFFFFF]/85 to-transparent z-30 pointer-events-none" />

        {/* 3D Smooth Infinite Glide Track */}
        <div className="w-full overflow-hidden flex items-center py-1 sm:py-2 sm:pt-3 sm:pb-5 group/track cursor-grab">
          <div className="flex items-center gap-5 sm:gap-7 md:gap-8 animate-marquee-infinite group-hover/track:animate-marquee-paused">
            {displayBooks.map((book, idx) => (
              <div
                key={`${book.id}-${idx}`}
                className="shrink-0 transition-transform duration-300 transform-gpu py-2"
              >
                <HeroBook3D
                  book={book}
                  onClick={() => {
                    if (onSelectBook) onSelectBook(book);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 5. CTA ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5 sm:mb-6">
          <a
            href="#bestsellers"
            onClick={(e) => {
              if (onExploreBooks) {
                e.preventDefault();
                onExploreBooks();
              }
            }}
            className="inline-flex items-center gap-2 bg-[#C61821] hover:bg-[#A81119] text-white px-5 sm:px-6 py-2 rounded-[5px] text-xs sm:text-sm shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 active:scale-95 transition-all duration-200 font-bold"
          >
            <span>Explore All Books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#categories"
            onClick={(e) => {
              if (onViewAuthors) {
                e.preventDefault();
                onViewAuthors();
              }
            }}
            className="inline-flex items-center gap-2 bg-white hover:bg-red-50/60 text-[#C61821] border border-[#C61821]/75 px-5 sm:px-6 py-2 rounded-[5px] font-bold text-xs sm:text-sm hover:border-[#A81119] active:scale-95 transition-all duration-200 shadow-2xs font-650"
          >
            <span>View Categories</span>
          </a>
        </div>

      {/* 6. SLIDING INFINITE TICKER STRIP (Modern, Unique & Infinite Scrolling) */}
      <div className="sliding-text-one group-ticker w-full bg-gradient-to-r from-[#8B0F15] via-[#C61821] to-[#7A0D12] py-2.5 sm:py-3.5 overflow-hidden shadow-xl border-y border-[#C61821]/60 select-none relative z-10 mt-3 sm:mt-5">
        {/* Left & Right Soft Fade Edge Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#8B0F15] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#7A0D12] to-transparent z-20 pointer-events-none" />

        <div className="sliding-text-one__wrap flex overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap m-0 p-0 items-center">
            {/* Track 1 */}
            <div className="js-marquee flex items-center shrink-0">
              {[
                { title: "Fast Shipping", subtitle: "All India Delivery", icon: Truck },
                { title: "100% Secure", subtitle: "Payment Protection", icon: ShieldCheck },
                { title: "Original Books", subtitle: "Devanagari Publication", icon: Award },
                { title: "High Quality", subtitle: "Premium Printing", icon: BookOpen },
                { title: "27+ Years", subtitle: "Trusted Publishing", icon: Calendar },
                { title: "500+ Titles", subtitle: "Exam Oriented Books", icon: Library },
                { title: "50K+ Readers", subtitle: "Pan-India Aspirants", icon: Users },
                { title: "2025-26 Edition", subtitle: "Updated Syllabus", icon: Sparkles },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`ticker-1-${idx}`}
                    className="inline-flex items-center mx-3 sm:mx-5 md:mx-7 group/item cursor-default transition-transform duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* Icon Bubble */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white shadow-inner group-hover/item:bg-white group-hover/item:text-[#C61821] group-hover/item:rotate-6 transition-all duration-300 shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 stroke-[2]" />
                      </div>

                      {/* Text details */}
                      <div className="flex flex-col">
                        <span className="font-heading font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider text-white group-hover/item:text-amber-300 transition-colors duration-300 drop-shadow-2xs">
                          {item.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-red-100/90 -mt-0.5 tracking-wide">
                          {item.subtitle}
                        </span>
                      </div>

                      {/* Sparkle separator */}
                      <div className="ml-3 sm:ml-5 md:ml-7 text-amber-300/70 shrink-0">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Track 2 (Duplicate for Seamless Loop) */}
            <div className="js-marquee flex items-center shrink-0" aria-hidden="true">
              {[
                { title: "Fast Shipping", subtitle: "All India Delivery", icon: Truck },
                { title: "100% Secure", subtitle: "Payment Protection", icon: ShieldCheck },
                { title: "Original Books", subtitle: "Devanagari Publication", icon: Award },
                { title: "High Quality", subtitle: "Premium Printing", icon: BookOpen },
                { title: "27+ Years", subtitle: "Trusted Publishing", icon: Calendar },
                { title: "500+ Titles", subtitle: "Exam Oriented Books", icon: Library },
                { title: "50K+ Readers", subtitle: "Pan-India Aspirants", icon: Users },
                { title: "2025-26 Edition", subtitle: "Updated Syllabus", icon: Sparkles },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`ticker-2-${idx}`}
                    className="inline-flex items-center mx-3 sm:mx-5 md:mx-7 group/item cursor-default transition-transform duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* Icon Bubble */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white shadow-inner group-hover/item:bg-white group-hover/item:text-[#C61821] group-hover/item:rotate-6 transition-all duration-300 shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 stroke-[2]" />
                      </div>

                      {/* Text details */}
                      <div className="flex flex-col">
                        <span className="font-heading font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider text-white group-hover/item:text-amber-300 transition-colors duration-300 drop-shadow-2xs">
                          {item.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-red-100/90 -mt-0.5 tracking-wide">
                          {item.subtitle}
                        </span>
                      </div>

                      {/* Sparkle separator */}
                      <div className="ml-3 sm:ml-5 md:ml-7 text-amber-300/70 shrink-0">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
