"use client";

import React from "react";
import { getImageProps } from "next/image";
import {
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { HERO_BANNER_DEFAULT, HERO_TEXT_DEFAULTS, type BookData } from "@/data/heroContent";
import { SITE_DEFAULTS, heroStatsFromSettings, type HeroStat } from "@/lib/site-settings";

interface HeroSectionProps {
  books?: BookData[];
  bannerImage?: string;
  /** Optional 9:16 portrait banner shown below the `lg` breakpoint; falls back to `bannerImage`. */
  mobileBannerImage?: string;
  stats?: HeroStat[];
  badgeText?: string;
  editionBadge?: string;
  headingLine1?: string;
  headingHighlight?: string;
  headingLine3?: string;
  description?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  onSelectBook?: (book: BookData) => void;
  onExploreBooks?: () => void;
  onViewAuthors?: () => void;
}

const STAT_ICONS = [BookOpen, Users, ShieldCheck, GraduationCap];

export default function HeroSection({
  bannerImage = HERO_BANNER_DEFAULT,
  mobileBannerImage,
  stats = heroStatsFromSettings(SITE_DEFAULTS),
  badgeText = HERO_TEXT_DEFAULTS.badgeText,
  editionBadge = HERO_TEXT_DEFAULTS.editionBadge,
  headingLine1 = HERO_TEXT_DEFAULTS.headingLine1,
  headingHighlight = HERO_TEXT_DEFAULTS.headingHighlight,
  headingLine3 = HERO_TEXT_DEFAULTS.headingLine3,
  description = HERO_TEXT_DEFAULTS.description,
  ctaPrimaryLabel = HERO_TEXT_DEFAULTS.ctaPrimaryLabel,
  ctaSecondaryLabel = HERO_TEXT_DEFAULTS.ctaSecondaryLabel,
  onExploreBooks,
  onViewAuthors,
}: HeroSectionProps) {
  const imageCommon = { alt: "", fill: true, sizes: "100vw", priority: true } as const;
  const { props: { srcSet: desktopSrcSet } } = getImageProps({ ...imageCommon, src: bannerImage });
  const { props: { srcSet: mobileSrcSet, ...mobileImgProps } } = getImageProps({
    ...imageCommon,
    src: mobileBannerImage || bannerImage,
  });


  // A dedicated 9:16 mobile banner is used below the lg breakpoint (phones and tablets): the section
  // takes the banner's ratio so the whole image shows, and the copy is compacted into its empty top area.
  const compact = Boolean(mobileBannerImage);

  return (
    <section
      aria-label="Hero"
      className={`relative overflow-hidden bg-[#FDF3F2] lg:flex lg:min-h-[760px] lg:items-center ${
        compact ? "aspect-[9/16] lg:aspect-auto" : ""
      }`}
    >
      {/* Full-bleed background on all sizes (books, emblem, category list, tricolor wave) */}
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
          <img
            {...mobileImgProps}
            srcSet={mobileSrcSet}
            alt=""
            aria-hidden="true"
            className={`object-cover ${compact ? "object-center" : "object-[center_38%]"} lg:object-[center_38%]`}
          />
        </picture>
        {/* Keep copy readable over the shared banner on phones/tablets; not needed on a dedicated mobile banner. */}
        {!compact && <div className="absolute inset-0 bg-[#FDF3F2]/70 lg:hidden" />}
      </div>

      {/* Left editorial copy */}
      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-2xl lg:max-w-[46%] lg:py-16 ${compact ? "py-4 sm:py-6 md:py-8" : "py-10 sm:py-14"}`}>
          {/* Trust badge */}
          <div className={`inline-flex items-center gap-2.5 rounded-full border border-red-100 bg-white/95 shadow-sm backdrop-blur-sm ${compact ? "px-3 py-1 sm:px-3.5 sm:py-1.5" : "px-3.5 py-1.5"}`}>
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-[#C61821]"
              strokeWidth={2.2}
            />
            <span className={`font-medium text-gray-700 ${compact ? "text-[11px] sm:text-xs md:text-[13px]" : "text-xs sm:text-[13px]"}`}>
              {badgeText}
            </span>
            <span className="hidden items-center gap-1 border-l border-red-100 pl-2.5 text-[11px] font-semibold text-[#C61821] sm:inline-flex">
              <Sparkles className="h-3 w-3" /> {editionBadge}
            </span>
          </div>

          {/* Heading */}
          <h1 className={`font-serif font-bold leading-[1.08] tracking-tight text-[#101828] lg:mt-5 lg:text-[clamp(44px,4.3vw,64px)] ${compact ? "mt-3 text-[26px] sm:text-[34px] md:mt-5 md:text-[44px]" : "mt-5 text-[34px] sm:text-5xl"}`}>
            {headingLine1}
            <br />
            <span className="text-[#C61821]">{headingHighlight}</span>
            <br />
            {headingLine3}
          </h1>

          {/* Description */}
          <p className={`max-w-xl leading-relaxed text-gray-600 lg:mt-5 lg:text-base ${compact ? "mt-2 text-[13px] leading-snug sm:text-sm md:mt-4 md:text-base" : "mt-5 text-sm sm:text-base"}`}>
            {description}
          </p>

          {/* CTA buttons */}
          <div className={`flex lg:mt-7 lg:flex-row lg:items-center ${compact ? "mt-4 flex-row gap-2 sm:gap-3 md:mt-6" : "mt-7 flex-col gap-3 sm:flex-row sm:items-center"}`}>
            <a
              href="#bestsellers"
              onClick={(e) => {
                if (onExploreBooks) {
                  e.preventDefault();
                  onExploreBooks();
                }
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#C61821] font-bold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-[#A81119] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C61821] focus-visible:ring-offset-2 active:scale-[0.98] lg:px-6 lg:py-3 ${compact ? "flex-1 px-3 py-2.5 text-[13px] sm:flex-none sm:px-6 sm:text-sm md:py-3" : "px-6 py-3 text-sm"}`}
            >
              {ctaPrimaryLabel}
              <ArrowRight className={`h-4 w-4 ${compact ? "max-sm:hidden" : ""}`} />
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                if (onViewAuthors) {
                  e.preventDefault();
                  onViewAuthors();
                }
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#C61821] bg-white font-bold text-[#C61821] transition-all duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C61821] focus-visible:ring-offset-2 active:scale-[0.98] lg:px-6 lg:py-3 ${compact ? "flex-1 px-3 py-2.5 text-[13px] sm:flex-none sm:px-6 sm:text-sm md:py-3" : "px-6 py-3 text-sm"}`}
            >
              {ctaSecondaryLabel}
            </a>
          </div>

          {/* Statistics (hidden below lg with a dedicated mobile banner: they would sit on its artwork) */}
          <dl className={`mt-9 gap-x-4 gap-y-5 ${compact ? "hidden lg:flex lg:items-center lg:gap-0" : "grid grid-cols-2 sm:flex sm:items-center sm:gap-0"}`}>
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i] ?? BookOpen;
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
