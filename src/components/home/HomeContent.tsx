"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Library,
  Users,
  Sparkles,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories, { FeaturedCategory } from "@/components/home/FeaturedCategories";
import HandpickedSection, { HandpickedBook } from "@/components/home/HandpickedSection";
import BestsellersSection, { BestsellerBook } from "@/components/home/BestsellersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HeroBook3D, { BookData } from "@/components/home/HeroBook3D";
import FeaturedOfferPopup from "@/components/home/FeaturedOfferPopup";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";
import { SITE_DEFAULTS, heroStatsFromSettings, type HeroStat } from "@/lib/site-settings";

interface HomeContentProps {
  heroBooks?: BookData[];
  heroBannerImage?: string;
  heroStats?: HeroStat[];
  categories?: FeaturedCategory[];
  bestsellers?: BestsellerBook[];
  handpicked?: HandpickedBook[];
}

const STATIC_TICKER_ITEMS = [
  { title: "2025-26 Edition", subtitle: "Updated Syllabus", icon: Sparkles },
  { title: "Fast Shipping", subtitle: "All India Delivery", icon: Truck },
  { title: "100% Secure", subtitle: "Payment Protection", icon: ShieldCheck },
  { title: "Original Books", subtitle: "Devanagari Publication", icon: Award },
  { title: "High Quality", subtitle: "Premium Printing", icon: BookOpen },
];

// Reuses the same hero stats (titles/readers/years) so the ticker can never drift out of sync with the banner.
function buildTickerItems(heroStats: HeroStat[]) {
  const [titles, readers, years] = heroStats;
  return [
    ...STATIC_TICKER_ITEMS,
    { title: years?.value ?? "4+ Years", subtitle: years?.label ?? "Trusted Publishing", icon: Calendar },
    { title: titles?.value ?? "10+", subtitle: titles?.label ?? "Exam Oriented Titles", icon: Library },
    { title: readers?.value ?? "25K+", subtitle: readers?.label ?? "Pan-India Readers", icon: Users },
  ];
}

function TickerTrack({ items, ariaHidden = false }: { items: ReturnType<typeof buildTickerItems>; ariaHidden?: boolean }) {
  return (
    <div
      className="js-marquee flex items-center shrink-0"
      aria-hidden={ariaHidden}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={`${ariaHidden ? "b" : "a"}-${idx}`}
            className="inline-flex items-center mx-3 sm:mx-5 md:mx-7 group/item cursor-default transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white shadow-inner group-hover/item:bg-white group-hover/item:text-[#C61821] group-hover/item:rotate-6 transition-all duration-300 shrink-0">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider text-white group-hover/item:text-amber-300 transition-colors duration-300 drop-shadow-2xs">
                  {item.title}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-red-100/90 -mt-0.5 tracking-wide">
                  {item.subtitle}
                </span>
              </div>
              <div className="ml-3 sm:ml-5 md:ml-7 text-amber-300/70 shrink-0">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomeContent({
  heroBooks,
  heroBannerImage,
  heroStats = heroStatsFromSettings(SITE_DEFAULTS),
  categories,
  bestsellers,
  handpicked,
}: HomeContentProps) {
  const router = useRouter();
  const tickerItems = buildTickerItems(heroStats);
  const { wishlist, addToCart, toggleWishlist } = useCartWishlist();
  const goToProduct = (book: BookData) => router.push(`/product/${book.id}`);

  const wishlistIds = wishlist.map((w) => w.id);

  const handleAddToCart = (book: BookData) => {
    addToCart({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author || "Devanagari Publications",
      category: book.category,
      price: book.price,
      originalPrice: book.originalPrice,
      image: book.image || "/images/books/image-2.png",
      edition: book.edition,
      coverType: book.coverType,
    });
  };

  const handleToggleWishlist = (book: BookData) => {
    toggleWishlist({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author || "Devanagari Publications",
      category: book.category,
      price: book.price,
      originalPrice: book.originalPrice,
      image: book.image || "/images/books/image-2.png",
      edition: book.edition,
      rating: book.rating,
      reviewsCount: book.reviewsCount,
      coverType: book.coverType,
    });
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection
        books={heroBooks}
        bannerImage={heroBannerImage}
        stats={heroStats}
        onSelectBook={goToProduct}
        onExploreBooks={() => {
          const el = document.getElementById("bestsellers");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 1b. TRUST TICKER STRIP */}
      <div className="group-ticker w-full bg-gradient-to-r from-[#8B0F15] via-[#C61821] to-[#7A0D12] py-2.5 sm:py-3.5 overflow-hidden shadow-xl border-y border-[#C61821]/60 select-none relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#8B0F15] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#7A0D12] to-transparent z-20 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap m-0 p-0 items-center">
            <TickerTrack items={tickerItems} />
            <TickerTrack items={tickerItems} ariaHidden />
          </div>
        </div>
      </div>

      {/* 1c. MOVING 3D BOOK SHOWCASE */}
      {heroBooks && heroBooks.length > 0 && (
        <div
          aria-label="Moving book carousel"
          className="w-full relative overflow-hidden bg-[#FBFBFC] pt-6 sm:pt-8 pb-4"
        >
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#FBFBFC] via-[#FBFBFC]/80 to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#FBFBFC] via-[#FBFBFC]/80 to-transparent z-30 pointer-events-none" />

          <div className="w-full overflow-hidden flex items-center py-1 sm:py-2 group/track cursor-grab">
            <div className="flex items-center gap-5 sm:gap-7 md:gap-8 animate-marquee-infinite group-hover/track:animate-marquee-paused">
              {[...heroBooks, ...heroBooks, ...heroBooks].map((book, idx) => (
                <div
                  key={`${book.id}-${idx}`}
                  data-hero-book-id={book.id}
                  className="shrink-0 transition-transform duration-300 transform-gpu py-2"
                >
                  <HeroBook3D book={book} onClick={() => goToProduct(book)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FEATURED EXAM CATEGORIES */}
      <FeaturedCategories categories={categories} />

      {/* 4. ASPIRANTS' MOST LOVED BOOKS (reuses Bestsellers) */}
      <BestsellersSection
        books={bestsellers}
        onAddToCart={handleAddToCart}
        onQuickView={goToProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 7. EXISTING HANDPICKED — kept as remaining content */}
      <HandpickedSection
        books={handpicked}
        onAddToCart={handleAddToCart}
        onQuickView={goToProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 8. TESTIMONIALS (legacy) */}
      <TestimonialsSection />

      {/* 9. FEATURED OFFER PROMO POPUP */}
      <FeaturedOfferPopup />
    </>
  );
}
