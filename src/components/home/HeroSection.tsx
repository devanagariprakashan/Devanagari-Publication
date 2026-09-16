"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { HERO_BANNER_DEFAULT, type BookData } from "@/data/heroContent";

interface HeroSectionProps {
  books?: BookData[];
  bannerImage?: string;
  onSelectBook?: (book: BookData) => void;
  onExploreBooks?: () => void;
  onViewAuthors?: () => void;
}

const STATS = [
  { icon: BookOpen, value: "500+", label: "Exam Oriented Titles" },
  { icon: Users, value: "50K+", label: "Pan-India Readers" },
  { icon: ShieldCheck, value: "27+ Years", label: "Trusted Publishing" },
  { icon: GraduationCap, value: "Expert", label: "Educator Team" },
];

export default function HeroSection({
  bannerImage = HERO_BANNER_DEFAULT,
  onExploreBooks,
  onViewAuthors,
}: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-[#FDF3F2] lg:flex lg:min-h-[760px] lg:items-center"
    >
      {/* Full-bleed background on all sizes (books, emblem, category list, tricolor wave) */}
      <div className="absolute inset-0">
        <Image
          src={bannerImage}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        {/* Keep copy readable over the banner on mobile/tablet */}
        <div className="absolute inset-0 bg-[#FDF3F2]/70 lg:hidden" />
      </div>

      {/* Left editorial copy */}
      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl py-10 sm:py-14 lg:max-w-[46%] lg:py-16">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-red-100 bg-white/95 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-[#C61821]"
              strokeWidth={2.2}
            />
            <span className="text-xs font-medium text-gray-700 sm:text-[13px]">
              India&apos;s Trusted Publication for Competitive Exams
            </span>
            <span className="hidden items-center gap-1 border-l border-red-100 pl-2.5 text-[11px] font-semibold text-[#C61821] sm:inline-flex">
              <Sparkles className="h-3 w-3" /> 2025-26 Edition
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-5 font-serif text-[34px] font-bold leading-[1.08] tracking-tight text-[#101828] sm:text-5xl lg:text-[clamp(44px,4.3vw,64px)]">
            India&apos;s Trusted
            <br />
            <span className="text-[#C61821]">Publication</span>
            <br />
            for Competitive Exams
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            High-quality, exam-oriented study material for{" "}
            <strong className="font-semibold text-[#C61821]">MPPSC</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">Judiciary</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">SI</strong>,{" "}
            <strong className="font-semibold text-[#C61821]">
              Hindi Grammar &amp; Law
            </strong>{" "}
            — prepared by expert educators.
          </p>

          {/* CTA buttons */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#bestsellers"
              onClick={(e) => {
                if (onExploreBooks) {
                  e.preventDefault();
                  onExploreBooks();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C61821] px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-[#A81119] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C61821] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Explore All Books
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                if (onViewAuthors) {
                  e.preventDefault();
                  onViewAuthors();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C61821] bg-white px-6 py-3 text-sm font-bold text-[#C61821] transition-all duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C61821] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              View Categories
            </a>
          </div>

          {/* Statistics */}
          <dl className="mt-9 grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:items-center sm:gap-0">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex items-center gap-2.5 ${
                    i > 0 ? "sm:border-l sm:border-gray-300/70 sm:pl-5" : "sm:pr-5"
                  }`}
                >
                  <Icon
                    className="h-6 w-6 shrink-0 text-[#C61821]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-base font-bold leading-tight text-[#101828] sm:text-lg">
                      {stat.value}
                    </dt>
                    <dd className="text-[11px] font-medium leading-tight text-gray-500">
                      {stat.label}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
