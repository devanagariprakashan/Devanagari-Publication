"use client";

import React from "react";
import Link from "next/link";
import { X, Star, ShoppingCart, Zap, Heart, ShieldCheck, Truck } from "lucide-react";
import { BookData, BookCoverCard } from "./HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

interface BookModalProps {
  book: BookData | null;
  onClose: () => void;
  onAddToCart?: (book: BookData) => void;
  onBuyNow?: (book: BookData) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (book: BookData) => void;
}

export default function BookModal({
  book,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted: propIsWishlisted,
  onToggleWishlist,
}: BookModalProps) {
  const {
    isInWishlist,
    isInCart,
    addToCart,
    toggleWishlist,
  } = useCartWishlist();

  if (!book) return null;

  const isWishlisted =
    propIsWishlisted !== undefined ? propIsWishlisted : isInWishlist(book.id);
  const isCarted = isInCart(book.id);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(book);
    } else {
      addToCart({
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author || "Devanagari Publications",
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
        coverType: book.coverType,
      });
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(book);
    } else {
      addToCart(
        {
          id: book.id,
          title: book.title,
          subtitle: book.subtitle,
          author: book.author || "Devanagari Publications",
          category: book.category,
          price: book.price,
          originalPrice: book.originalPrice,
          image: book.image,
          edition: book.edition,
          coverType: book.coverType,
        },
        1,
        true
      );
      onClose();
    }
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(book);
    } else {
      toggleWishlist({
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author || "Devanagari Publications",
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
        rating: book.rating,
        reviewsCount: book.reviewsCount,
        coverType: book.coverType,
      });
    }
  };

  const discountPercent = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[5px] sm:rounded-[5px] shadow-2xl max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-[5px] bg-gray-100/90 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Left Preview */}
          <div className="md:col-span-5 bg-gradient-to-b from-gray-100/80 via-gray-50/60 to-white p-4 sm:p-5 lg:p-6 flex flex-col justify-between items-center text-center relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative z-10 w-full flex justify-between items-center mb-2">
              <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 text-[#C61821] shadow-2xs border border-red-100">
                {book.edition || "2025-26 Edition"}
              </span>
              <div className="w-6 h-6 rounded-md bg-[#C61821] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                दे
              </div>
            </div>

            {/* Book 3D Showcase */}
            <div className="relative z-10 my-auto py-2 sm:py-3 flex items-center justify-center">
              {book.image ? (
                <div className="w-[145px] sm:w-[170px] md:w-[185px] lg:w-[200px] h-[190px] sm:h-[220px] md:h-[240px] lg:h-[255px] relative flex items-center justify-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
                  />
                </div>
              ) : (
                <div className="w-[140px] sm:w-[160px] md:w-[175px] aspect-[1/1.45] relative rounded-[5px] overflow-hidden shadow-2xl border border-black/20 group">
                  <BookCoverCard book={book} />
                  <div className="book-spine-effect" />
                  <div className="book-sheen-effect" />
                </div>
              )}
            </div>

            <div className="relative z-10 text-[11px] font-semibold text-gray-700 bg-white/95 rounded-full px-3.5 py-1 shadow-2xs mt-2 border border-gray-200/70">
              देवनागरी पब्लिकेशन प्रा. लि.
            </div>
          </div>

          {/* Right Details */}
          <div className="md:col-span-7 p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C61821] bg-red-50 px-2.5 py-0.5 rounded-full">
                  {book.category}
                </span>
                <span className="text-[11.5px] text-gray-500 font-medium">
                  {book.subject}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans tracking-tight">
                {book.title}
              </h2>
              {book.subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {book.subtitle}
                </p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2.5 text-xs sm:text-[13px]">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{book.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 font-medium">
                  {book.reviewsCount.toLocaleString()} Verified Aspirants
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5 mt-3 sm:mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#C61821] tracking-tight">
                  ₹{book.price}
                </span>
                <span className="text-base text-gray-400 line-through font-medium">
                  ₹{book.originalPrice}
                </span>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200/80 px-2 py-0.5 rounded-md">
                  {discountPercent}% OFF
                </span>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-2.5 mt-3.5 text-xs text-gray-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                  <Truck className="w-3.5 h-3.5 text-[#C61821] shrink-0" />
                  <span className="font-medium truncate">Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C61821] shrink-0" />
                  <span className="font-medium truncate">100% Original Book</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-[5px] border-2 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  isCarted
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-[#C61821] text-[#C61821] hover:bg-red-50"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isCarted ? "Added to Cart ✓" : "Add to Cart"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-[5px] bg-[#C61821] hover:bg-[#A81119] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2.5 sm:p-3 rounded-full border transition-all cursor-pointer ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-[#C61821]"
                    : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-[#C61821]"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-current text-[#C61821]" : ""}`}
                />
              </button>
            </div>

            {/* View Full Product Page Link */}
            <div className="pt-2 text-center">
              <Link
                href={`/product/${book.id}`}
                onClick={onClose}
                className="text-xs font-semibold text-[#C61821] hover:underline inline-flex items-center gap-1"
              >
                <span>View Complete Product Page & Details</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
