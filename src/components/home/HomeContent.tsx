"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories, { FeaturedCategory } from "@/components/home/FeaturedCategories";
import HandpickedSection, { HandpickedBook } from "@/components/home/HandpickedSection";
import BestsellersSection, { BestsellerBook } from "@/components/home/BestsellersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhatsNewSection from "@/components/home/WhatsNewSection";
import BookRatingsReviewsSection from "@/components/home/BookRatingsReviewsSection";
import { BookData } from "@/components/home/HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

interface HomeContentProps {
  categories?: FeaturedCategory[];
  bestsellers?: BestsellerBook[];
  handpicked?: HandpickedBook[];
}

export default function HomeContent({
  categories,
  bestsellers,
  handpicked,
}: HomeContentProps) {
  const router = useRouter();
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
      {/* 1. HERO SECTION WITH 3D CURVED CAROUSEL & FLOATING STATS */}
      <HeroSection
        onSelectBook={goToProduct}
        onExploreBooks={() => {
          const el = document.getElementById("bestsellers");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 2. FEATURED EXAM CATEGORIES */}
      <FeaturedCategories categories={categories} />

      {/* 3. WHAT'S NEW */}
      <WhatsNewSection />

      {/* 4. ASPIRANTS' MOST LOVED BOOKS (reuses Bestsellers) */}
      <BestsellersSection
        books={bestsellers}
        onAddToCart={handleAddToCart}
        onQuickView={goToProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 5. BOOK RATINGS & REVIEWS */}
      <BookRatingsReviewsSection />

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
    </>
  );
}
