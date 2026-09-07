"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories, { FeaturedCategory } from "@/components/home/FeaturedCategories";
import HandpickedSection, { HandpickedBook } from "@/components/home/HandpickedSection";
import BestsellersSection, { BestsellerBook } from "@/components/home/BestsellersSection";
import TopAuthorsSection, { AuthorItem } from "@/components/home/TopAuthorsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { BookData } from "@/components/home/HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

interface HomeContentProps {
  categories?: FeaturedCategory[];
  bestsellers?: BestsellerBook[];
  handpicked?: HandpickedBook[];
  authors?: AuthorItem[];
}

export default function HomeContent({
  categories,
  bestsellers,
  handpicked,
  authors,
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
        onViewAuthors={() => {
          const el = document.getElementById("authors");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 2. FEATURED EXAM CATEGORIES */}
      <FeaturedCategories categories={categories} />

      {/* 3. BESTSELLERS / WHAT INDIA IS READING SECTION */}
      <BestsellersSection
        books={bestsellers}
        onAddToCart={handleAddToCart}
        onQuickView={goToProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 4. FEATURED / HANDPICKED FOR YOU BOOKS SECTION */}
      <HandpickedSection
        books={handpicked}
        onAddToCart={handleAddToCart}
        onQuickView={goToProduct}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 5. TOP AUTHORS / VOICES YOU CAN TRUST SECTION */}
      <TopAuthorsSection
        authors={authors}
        onSelectBook={goToProduct}
      />

      {/* 6. TESTIMONIALS / LOVED BY READERS ACROSS INDIA */}
      <TestimonialsSection />

      {/* 7. NEWSLETTER SUBSCRIPTION SECTION */}
      <NewsletterSection />
    </>
  );
}
