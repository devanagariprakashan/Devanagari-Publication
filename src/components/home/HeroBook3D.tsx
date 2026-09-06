"use client";

import React from "react";
import { Star, ShieldCheck, Sparkles } from "lucide-react";

export type BookCoverType =
  | "hindi"
  | "polity"
  | "essay"
  | "history"
  | "constitution"
  | "law"
  | "gk"
  | "economy"
  | "science"
  | "geography";

export interface BookData {
  id: number | string;
  title: string;
  subtitle?: string;
  subject: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  coverType: BookCoverType;
  bgColor: string;
  textColor?: string;
  accentColor?: string;
  features?: string[];
  edition?: string;
  author?: string;
  badge?: string;
  image?: string;
  description?: string;
  highlights?: string[];
  isbn?: string;
}

export const HERO_BOOKS: BookData[] = [
  {
    id: 1,
    title: "सामान्य हिंदी व्याकरण",
    subtitle: "व्याकरण, रचना एवं निबंध",
    subject: "Hindi Grammar",
    category: "MPPSC & SI Special",
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 1480,
    coverType: "hindi",
    bgColor: "from-[#8B151B] via-[#A81820] to-[#5C0A0E]",
    textColor: "#FFFFFF",
    accentColor: "#FDE047",
    edition: "2025-26 Edition",
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "भारत का इतिहास एवं संस्कृति",
    subtitle: "प्राचीन, मध्यकालीन व आधुनिक भारत",
    subject: "Indian History",
    category: "Civil Services / UPSC",
    price: 549,
    originalPrice: 799,
    rating: 5.0,
    reviewsCount: 3120,
    coverType: "history",
    bgColor: "from-[#084C38] via-[#0E6248] to-[#04281E]",
    textColor: "#FFFFFF",
    accentColor: "#FCD34D",
    edition: "Bestseller 2025",
    badge: "Top Rated",
  },
  {
    id: 3,
    title: "भारतीय संविधान एवं राजव्यवस्था",
    subtitle: "अनुच्छेदवार व्याख्या एवं केस स्टडी",
    subject: "Constitution & Polity",
    category: "MPPSC Paper-2 / UPSC",
    price: 479,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 2240,
    coverType: "polity",
    bgColor: "from-[#0F2B5C] via-[#1A3F82] to-[#081836]",
    textColor: "#FFFFFF",
    accentColor: "#93C5FD",
    edition: "Updated Amendments",
    badge: "Recommended",
  },
  {
    id: 4,
    title: "उच्च स्तरीय निबंध माला",
    subtitle: "समसामयिक, विधिक एवं दार्शनिक विषय",
    subject: "Essay Writing",
    category: "Mains Paper-6",
    price: 299,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 940,
    coverType: "essay",
    bgColor: "from-[#78350F] via-[#9A3412] to-[#451A03]",
    textColor: "#FFFFFF",
    accentColor: "#FDE68A",
    edition: "Standard Reference",
    badge: "50+ Essays",
  },
  {
    id: 5,
    title: "मध्य प्रदेश सामान्य ज्ञान (MP GK)",
    subtitle: "मानचित्र एवं तथ्यात्मक संपूर्ण संकलन",
    subject: "MP GK Special",
    category: "MPPSC Prelims & Mains",
    price: 389,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 2890,
    coverType: "gk",
    bgColor: "from-[#4C1D95] via-[#6B21A8] to-[#2E1065]",
    textColor: "#FFFFFF",
    accentColor: "#FDE047",
    edition: "2025-26 Edition",
    badge: "Topper's Pick",
  },
  {
    id: 6,
    title: "भारतीय न्याय संहिता (BNS 2024)",
    subtitle: "नवीन आपराधिक कानून एवं प्रक्रिया",
    subject: "Law & Judiciary",
    category: "Civil Judge & Judiciary",
    price: 449,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 1650,
    coverType: "law",
    bgColor: "from-[#4A0E13] via-[#681820] to-[#2A0609]",
    textColor: "#FFFFFF",
    accentColor: "#FBBF24",
    edition: "With New Codes",
    badge: "New 2025",
  },
  {
    id: 7,
    title: "भारतीय अर्थव्यवस्था एवं विकास",
    subtitle: "बजट, आर्थिक सर्वेक्षण व नीतियां",
    subject: "Indian Economy",
    category: "GS Paper-3",
    price: 429,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 1320,
    coverType: "economy",
    bgColor: "from-[#0E4E49] via-[#14726B] to-[#062B28]",
    textColor: "#FFFFFF",
    accentColor: "#5EEAD4",
    edition: "Economic Survey 2025",
    badge: "High Yield",
  },
  {
    id: 8,
    title: "विज्ञान, प्रौद्योगिकी एवं पर्यावरण",
    subtitle: "पारिस्थितिकी, आपदा प्रबंधन एवं तकनीकी",
    subject: "Science & Tech",
    category: "UPSC / State PCS",
    price: 399,
    originalPrice: 549,
    rating: 4.8,
    reviewsCount: 1150,
    coverType: "science",
    bgColor: "from-[#14532D] via-[#18753E] to-[#082C15]",
    textColor: "#FFFFFF",
    accentColor: "#86EFAC",
    edition: "Latest Syllabus",
    badge: "Updated",
  },
  {
    id: 9,
    title: "भूगोल - भारत एवं विश्व",
    subtitle: "भौतिक, सामाजिक एवं आर्थिक भूगोल",
    subject: "Geography",
    category: "General Studies",
    price: 459,
    originalPrice: 620,
    rating: 4.9,
    reviewsCount: 1980,
    coverType: "geography",
    bgColor: "from-[#1E3A8A] via-[#2563EB] to-[#0F1D45]",
    textColor: "#FFFFFF",
    accentColor: "#93C5FD",
    edition: "Atlas & Maps",
    badge: "Maps Included",
  },
];

/**
 * Thematic Vector Graphics matching each subject
 */
export function BookThematicArtwork({ type }: { type: BookCoverType }) {
  switch (type) {
    case "hindi":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Decorative Inkpot & Quill */}
          <path
            d="M60 48 C45 48 42 58 42 62 L78 62 C78 58 75 48 60 48 Z"
            fill="#FDE047"
            fillOpacity="0.8"
          />
          <rect x="52" y="44" width="16" height="5" rx="2" fill="#FEF08A" />
          {/* Quill Pen */}
          <path
            d="M62 44 Q78 24 88 8 Q82 20 68 34 Q64 38 60 44 Z"
            fill="#FEF08A"
          />
          <line x1="62" y1="44" x2="88" y2="8" stroke="#854D0E" strokeWidth="0.8" />
          {/* Scroll / Open Book lines */}
          <path
            d="M30 38 Q45 32 60 38 Q75 32 90 38 L90 52 Q75 46 60 52 Q45 46 30 52 Z"
            fill="rgba(255,255,255,0.12)"
            stroke="#FDE047"
            strokeWidth="0.7"
          />
          <line x1="38" y1="42" x2="52" y2="42" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1="38" y1="46" x2="52" y2="46" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1="68" y1="42" x2="82" y2="42" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1="68" y1="46" x2="82" y2="46" stroke="white" strokeOpacity="0.5" strokeWidth="0.8" />
        </svg>
      );

    case "history":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Heritage Fort & Sanchi Arch */}
          <ellipse cx="60" cy="58" rx="46" ry="6" fill="rgba(0,0,0,0.25)" />
          {/* Fort Base */}
          <rect x="25" y="42" width="70" height="18" rx="1" fill="#FCD34D" fillOpacity="0.85" />
          {/* Gate Arch */}
          <path d="M52 60 L52 48 Q60 42 68 48 L68 60 Z" fill="#04281E" />
          {/* Pillars */}
          <rect x="30" y="24" width="8" height="20" fill="#FDE68A" />
          <rect x="82" y="24" width="8" height="20" fill="#FDE68A" />
          {/* Domes */}
          <path d="M28 24 Q34 14 40 24 Z" fill="#F59E0B" />
          <path d="M80 24 Q86 14 92 24 Z" fill="#F59E0B" />
          <path d="M48 42 Q60 22 72 42 Z" fill="#F59E0B" />
          <circle cx="60" cy="22" r="2.5" fill="#FEF3C7" />
        </svg>
      );

    case "polity":
    case "constitution":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Parliament / Constitution Pillars */}
          <rect x="20" y="54" width="80" height="6" rx="2" fill="#93C5FD" fillOpacity="0.8" />
          <rect x="24" y="28" width="72" height="4" fill="#BFDBFE" />
          {/* Pillars */}
          {[28, 38, 48, 58, 68, 78, 88].map((x, i) => (
            <rect key={i} x={x} y="32" width="4" height="22" fill="#DBEAFE" fillOpacity="0.9" />
          ))}
          {/* Dome & Ashoka Chakra Emblem */}
          <path d="M42 28 Q60 10 78 28 Z" fill="#3B82F6" stroke="#93C5FD" strokeWidth="0.8" />
          <circle cx="60" cy="20" r="5" fill="#1E3A8A" stroke="#FDE047" strokeWidth="1" />
          <circle cx="60" cy="20" r="1.5" fill="#FDE047" />
        </svg>
      );

    case "essay":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Creative Mandala & Writing Ribbon */}
          <circle cx="60" cy="35" r="22" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          <circle cx="60" cy="35" r="14" stroke="#FDE68A" strokeWidth="0.6" opacity="0.4" />
          {/* Feather Quill Pen */}
          <path
            d="M45 52 Q62 30 75 14 C73 24 64 38 52 46 Z"
            fill="#FDE68A"
            fillOpacity="0.9"
          />
          <path d="M52 46 L44 54 L48 48 Z" fill="#B45309" />
          {/* Ribbon */}
          <path
            d="M32 50 Q60 42 88 50 L84 56 Q60 50 36 56 Z"
            fill="#FEF3C7"
            fillOpacity="0.75"
          />
        </svg>
      );

    case "gk":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Madhya Pradesh Map Outline & Compass Rose */}
          <path
            d="M38 30 Q46 22 58 24 Q68 18 78 26 Q86 28 88 38 Q82 50 72 52 Q58 56 46 50 Q36 44 38 30 Z"
            fill="rgba(253, 224, 71, 0.18)"
            stroke="#FDE047"
            strokeWidth="1.2"
          />
          {/* Compass Star */}
          <g transform="translate(60, 36)">
            <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FDE047" />
            <circle cx="0" cy="0" r="2" fill="#4C1D95" />
          </g>
          <text x="60" y="58" textAnchor="middle" fill="#FEF08A" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            MP SPECIAL
          </text>
        </svg>
      );

    case "law":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Scales of Justice (तराजू) */}
          <line x1="60" y1="18" x2="60" y2="56" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="24" x2="84" y2="24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="18" r="3.5" fill="#FDE68A" />
          {/* Base */}
          <path d="M48 56 L72 56 L68 62 L52 62 Z" fill="#F59E0B" />
          {/* Left Pan */}
          <line x1="36" y1="24" x2="28" y2="38" stroke="#FDE68A" strokeWidth="0.8" />
          <line x1="36" y1="24" x2="44" y2="38" stroke="#FDE68A" strokeWidth="0.8" />
          <path d="M26 38 Q36 45 46 38 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
          {/* Right Pan */}
          <line x1="84" y1="24" x2="76" y2="38" stroke="#FDE68A" strokeWidth="0.8" />
          <line x1="84" y1="24" x2="92" y2="38" stroke="#FDE68A" strokeWidth="0.8" />
          <path d="M74 38 Q84 45 94 38 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.8" />
        </svg>
      );

    case "economy":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Rupee Symbol & Ascending Growth Graph */}
          <path
            d="M25 54 L45 42 L65 48 L95 24"
            stroke="#5EEAD4"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="95,24 86,25 93,33" fill="#5EEAD4" />
          {/* Rupee Coin Emblem */}
          <circle cx="60" cy="30" r="14" fill="#042F2E" stroke="#5EEAD4" strokeWidth="1.5" />
          <text
            x="60"
            y="35"
            textAnchor="middle"
            fill="#5EEAD4"
            fontSize="15"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            ₹
          </text>
        </svg>
      );

    case "science":
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Atom Orbitals & Eco Leaf */}
          <ellipse cx="60" cy="35" rx="26" ry="10" stroke="#86EFAC" strokeWidth="1" transform="rotate(-30 60 35)" />
          <ellipse cx="60" cy="35" rx="26" ry="10" stroke="#86EFAC" strokeWidth="1" transform="rotate(30 60 35)" />
          <ellipse cx="60" cy="35" rx="26" ry="10" stroke="#86EFAC" strokeWidth="1" transform="rotate(90 60 35)" />
          <circle cx="60" cy="35" r="4" fill="#4ADE80" />
          <circle cx="78" cy="24" r="2" fill="#FDE047" />
          <circle cx="42" cy="46" r="2" fill="#FDE047" />
        </svg>
      );

    case "geography":
    default:
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full" fill="none">
          {/* Globe with Lat/Long & Continents */}
          <circle cx="60" cy="35" r="20" fill="rgba(37, 99, 235, 0.3)" stroke="#93C5FD" strokeWidth="1.2" />
          <ellipse cx="60" cy="35" rx="20" ry="8" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="1 1" />
          <ellipse cx="60" cy="35" rx="10" ry="20" stroke="#93C5FD" strokeWidth="0.8" />
          <line x1="40" y1="35" x2="80" y2="35" stroke="#93C5FD" strokeWidth="0.8" />
          <line x1="60" y1="15" x2="60" y2="55" stroke="#93C5FD" strokeWidth="0.8" />
          {/* Continent contours */}
          <path d="M52 28 Q58 25 64 29 Q62 36 55 35 Z" fill="#86EFAC" fillOpacity="0.7" />
          <path d="M62 38 Q70 36 72 44 Q65 48 60 42 Z" fill="#86EFAC" fillOpacity="0.7" />
        </svg>
      );
  }
}

/**
 * Standalone Realistic 3D Book Cover Component (Vector & CSS Design)
 */
export function BookCoverCard({
  book,
  className = "",
}: {
  book: BookData;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full h-full rounded-[4px] overflow-hidden bg-gradient-to-b ${book.bgColor} text-white shadow-inner flex flex-col justify-between p-2.5 sm:p-3 select-none border border-white/20 ${className}`}
    >
      {/* Decorative Gold / Foil Corner Trims */}
      <div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 border border-amber-300/30 rounded-[3px] pointer-events-none" />
      <div className="absolute top-2 left-2 right-2 bottom-2 border border-white/15 rounded-[2px] pointer-events-none" />

      {/* TOP HEADER: Brand & Insignia Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-devanagari font-bold text-[9px] sm:text-[10px] tracking-wider text-amber-200 uppercase drop-shadow-xs">
            देवनागरी
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Red Square 'दे' Insignia */}
          <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded bg-[#C61821] border border-amber-300/60 text-white flex items-center justify-center shadow-xs">
            <span className="font-devanagari font-bold text-[8px] sm:text-[9px] leading-none">
              दे
            </span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Main Title, Subtitle, Category */}
      <div className="relative z-10 text-center my-auto flex flex-col items-center justify-center px-1">
        {/* Category Pill */}
        <div className="mb-1">
          <span className="inline-block px-1.5 py-0.5 rounded-[3px] bg-black/30 border border-white/20 text-[7.5px] sm:text-[8.5px] font-semibold tracking-wide text-amber-200/95">
            {book.category}
          </span>
        </div>

        {/* Primary Hindi Book Title */}
        <h3 className="font-devanagari font-extrabold text-[12px] sm:text-[13.5px] md:text-[14px] leading-tight text-white drop-shadow-md">
          {book.title}
        </h3>

        {/* Subtitle */}
        {book.subtitle && (
          <p className="font-devanagari text-[8px] sm:text-[9px] text-white/80 mt-0.5 line-clamp-1 leading-tight font-medium">
            {book.subtitle}
          </p>
        )}
      </div>

      {/* THEMATIC VECTOR ARTWORK */}
      <div className="relative z-10 w-full h-11 sm:h-13 my-0.5 flex items-center justify-center opacity-90 drop-shadow-xs">
        <BookThematicArtwork type={book.coverType} />
      </div>

      {/* BOTTOM FOOTER: Edition Ribbon & Certified Stamp */}
      <div className="relative z-10 pt-1 border-t border-white/20 flex items-center justify-between text-[7px] sm:text-[8px] text-amber-200/90 font-medium">
        <span className="truncate max-w-[85px]">
          {book.edition || "2025-26 Edition"}
        </span>
        <span className="font-semibold text-white/90">
          ★ प्रामाणिक ★
        </span>
      </div>
    </div>
  );
}

interface HeroBook3DProps {
  book: BookData;
  isActive?: boolean;
  offset?: number;
  onClick?: () => void;
  className?: string;
}

export default function HeroBook3D({
  book,
  isActive = false,
  onClick,
  className = "",
}: HeroBook3DProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none shrink-0 py-2 px-1 ${className}`}
    >
      {/* 3D Realistic Book Container */}
      <div className="relative w-[135px] sm:w-[155px] md:w-[168px] lg:w-[178px] aspect-[1/1.45] book-cover-3d book-floor-shadow overflow-visible">
        {/* Book Left Spine Crease & Shadow */}
        <div className="book-spine-effect" />

        {/* Book Right Page Edge Thickness */}
        <div className="book-pages-layer" />

        {/* Real Hardcover Custom Background Book Face */}
        <div className="relative w-full h-full rounded-[4px] overflow-hidden bg-white border border-black/20">
          <BookCoverCard book={book} />

          {/* Book Glossy Sheen Overlay */}
          <div className="book-sheen-effect" />

          {/* Floating Top Badge (e.g. Bestseller / Discount) */}
          <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 pointer-events-none">
            {book.badge && (
              <span className="px-1.5 py-0.5 rounded-[3px] bg-[#C61821] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow-sm border border-amber-300/40">
                {book.badge}
              </span>
            )}
          </div>

          {/* Quick Hover Overlay Badge with Price & Rating */}
          <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium py-1 px-1.5 rounded text-center truncate shadow-md border border-white/20">
            <span className="font-bold text-white">₹{book.price}</span>{" "}
            <span className="text-gray-300 line-through text-[9px]">
              ₹{book.originalPrice}
            </span>{" "}
            • <span className="text-amber-300 font-semibold">★ {book.rating}</span>
          </div>
        </div>
      </div>

      {/* Realistic Floor Shadow Underneath */}
      <div className="w-[85%] h-2.5 bg-black/25 blur-[5px] rounded-full mx-auto mt-2 transition-all duration-300 group-hover:w-[90%] group-hover:opacity-40" />
    </div>
  );
}

