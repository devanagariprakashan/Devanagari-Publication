"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookData } from "./HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

export interface HandpickedBook {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  examCategory: string;
  subject: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  edition?: string;
}

export const HANDPICKED_BOOKS: HandpickedBook[] = [
  {
    id: 201,
    title: "Samanya Hindi Exam Vyakaran",
    subtitle: "मध्य प्रदेश लोक सेवा आयोग एवं अन्य राज्य परीक्षाओं हेतु",
    author: "by Mr. Mayank Jagdish Sharma",
    examCategory: "MPPSC",
    subject: "Hindi Grammar",
    category: "MPPSC & SI Special",
    price: 900,
    originalPrice: 1000,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 1876,
    badge: "BESTSELLER",
    image: "/images/books/image-2.png",
    edition: "3rd Edition 2025-26",
  },
  {
    id: 202,
    title: "Nibandh Sanhita",
    subtitle: "मुख्य परीक्षा विशेषांक एवं प्रारूप चंद्रिका",
    author: "by Mr. Mayank Jagdish Sharma",
    examCategory: "MPPSC",
    subject: "Essay Writing",
    category: "Mains Paper-6",
    price: 249,
    originalPrice: 349,
    discountPercent: 29,
    rating: 4.9,
    reviewsCount: 728,
    badge: "BESTSELLER",
    image: "/images/books/image-3.png",
    edition: "2nd Edition 2025",
  },
  {
    id: 203,
    title: "आधुनिक हिन्दी व्याकरण",
    subtitle: "हिंदी व्याकरण का व्यापक अध्ययन एवं संदर्भ",
    author: "by Devanagari Publications",
    examCategory: "MPPSC",
    subject: "Hindi Literature",
    category: "Hindi Special",
    price: 449,
    originalPrice: 599,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 1284,
    badge: "BESTSELLER",
    image: "/images/books/adhunik-hindi.png",
    edition: "Standard Edition",
  },
  {
    id: 204,
    title: "UPSC CSE Prelims Master",
    subtitle: "Comprehensive Prelims Strategy & Solved Papers",
    author: "by Mr. Anand Mishra",
    examCategory: "UPSC",
    subject: "General Studies",
    category: "Civil Services / UPSC",
    price: 699,
    originalPrice: 899,
    discountPercent: 22,
    rating: 4.6,
    reviewsCount: 2103,
    badge: "UPSC SPECIAL",
    image: "/images/books/upsc-master.png",
    edition: "2025 Edition",
  },
  // Slide 2 Books
  {
    id: 205,
    title: "मध्य प्रदेश सामान्य ज्ञान (MP GK)",
    subtitle: "मानचित्र एवं तथ्यात्मक संपूर्ण संकलन",
    author: "by Mr. Mayank Jagdish Sharma",
    examCategory: "MPPSC",
    subject: "MP GK Special",
    category: "MPPSC Prelims & Mains",
    price: 389,
    originalPrice: 550,
    discountPercent: 29,
    rating: 4.9,
    reviewsCount: 2890,
    badge: "TOPPER'S CHOICE",
    image: "/images/books/image-4.png",
    edition: "2025-26 Edition",
  },
  {
    id: 206,
    title: "भारतीय न्याय संहिता (BNS 2024)",
    subtitle: "नवीन आपराधिक कानून एवं प्रक्रिया",
    author: "by Devanagari Law Faculty",
    examCategory: "JUDICIARY",
    subject: "Law & IPC",
    category: "Civil Judge & Judiciary",
    price: 449,
    originalPrice: 599,
    discountPercent: 25,
    rating: 4.9,
    reviewsCount: 1650,
    badge: "NEW CODES",
    image: "/images/books/image-5.png",
    edition: "With Latest Codes",
  },
  {
    id: 207,
    title: "संपूर्ण हिंदी प्रश्न मालिका",
    subtitle: "गत वर्षों के हल प्रश्न पत्र व अभ्यास सेट",
    author: "by Mr. Mayank Jagdish Sharma",
    examCategory: "MPPSC",
    subject: "Hindi PYQ",
    category: "Practice Set",
    price: 299,
    originalPrice: 399,
    discountPercent: 25,
    rating: 4.8,
    reviewsCount: 1420,
    badge: "BESTSELLER",
    image: "/images/books/image-8.png",
    edition: "2025 Practice Edition",
  },
  {
    id: 208,
    title: "प्रारूप चंद्रिका एवं निबंध माला",
    subtitle: "शासकीय पत्र व्यवहार एवं निबंध प्रारूप",
    author: "by Mr. Mayank Jagdish Sharma",
    examCategory: "MPPSC",
    subject: "Essay & Drafting",
    category: "Mains Paper-6",
    price: 219,
    originalPrice: 299,
    discountPercent: 27,
    rating: 4.7,
    reviewsCount: 950,
    badge: "POPULAR",
    image: "/images/books/image-9.png",
    edition: "2025 Edition",
  },
];

interface HandpickedSectionProps {
  onAddToCart?: (book: BookData) => void;
  onQuickView?: (book: BookData) => void;
  wishlistIds?: Array<number | string>;
  onToggleWishlist?: (book: BookData) => void;
  books?: HandpickedBook[];
}

export default function HandpickedSection({
  onAddToCart,
  onQuickView,
  wishlistIds = [],
  onToggleWishlist,
  books,
}: HandpickedSectionProps) {
  const router = useRouter();
  const { isInCart, isInWishlist, addToCart, toggleWishlist } =
    useCartWishlist();

  const list = books ?? HANDPICKED_BOOKS;
  const FEATURED_LIMIT = 8;
  const hasTooManyBooks = list.length > FEATURED_LIMIT;

  const [currentPage, setCurrentPage] = useState(0);
  const [addedIds, setAddedIds] = useState<Array<number | string>>([]);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(list.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const convertToBookData = (book: HandpickedBook): BookData => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    subject: book.subject,
    category: book.category,
    price: book.price,
    originalPrice: book.originalPrice,
    rating: book.rating,
    reviewsCount: book.reviewsCount,
    coverType: "hindi",
    bgColor: "from-[#8B151B] via-[#A81820] to-[#5C0A0E]",
    textColor: "#FFFFFF",
    accentColor: "#FDE047",
    edition: book.edition,
    author: book.author,
    badge: book.badge,
    image: book.image,
  });

  const handleCartClick = (book: HandpickedBook, e: React.MouseEvent) => {
    e.stopPropagation();
    const bData = convertToBookData(book);
    setAddedIds((prev) => [...prev, book.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== book.id));
    }, 2000);
    if (onAddToCart) {
      onAddToCart(bData);
    } else {
      addToCart({
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
      });
    }
  };

  const handleWishlistClick = (book: HandpickedBook, e: React.MouseEvent) => {
    e.stopPropagation();
    const bData = convertToBookData(book);
    if (onToggleWishlist) {
      onToggleWishlist(bData);
    } else {
      toggleWishlist({
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
        rating: book.rating,
        reviewsCount: book.reviewsCount,
      });
    }
  };

  const handleCardClick = (book: HandpickedBook) => {
    if (onQuickView) {
      onQuickView(convertToBookData(book));
    }
  };

  const handleBrowseAll = () => {
    router.push("/shop");
  };

  const visibleBooks = list.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <section
      id="handpicked"
      className="relative py-10 sm:py-14 lg:py-16 bg-[#FAFAFC] overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[350px] bg-red-100/30 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-amber-50/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= TOP HEADER ROW ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            {/* Top Red Pill Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2.5px] bg-[#C61821] rounded-full" />
              <span className="text-xs font-extrabold tracking-widest text-[#C61821] uppercase">
                FEATURED
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 tracking-tight leading-tight flex items-center flex-wrap">
              Handpicked{" "}
              <span className="font-serif italic font-bold text-[#C61821]">
                {" "}for you
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-gray-500 mt-2.5 max-w-xl font-normal leading-relaxed">
              Editorial selections from the Devanagari team — the books we&apos;d put
              on our own shelves.
            </p>
          </div>

          {/* Right Action: Browse All Books Link & Button */}
          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button
              onClick={handleBrowseAll}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-50/80 hover:bg-red-100 border border-red-100/90 flex items-center justify-center text-[#C61821] transition-all hover:scale-105 shadow-2xs cursor-pointer shrink-0"
              aria-label="Browse all books"
            >
              <BookOpen className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              onClick={handleBrowseAll}
              className="group inline-flex items-center gap-1.5 text-sm sm:text-[15px] font-bold text-[#C61821] hover:text-[#A8131B] transition-colors cursor-pointer"
            >
              <span>Browse all books</span>
              <ArrowRight className="w-4 h-4 text-[#C61821] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {hasTooManyBooks && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <Sparkles className="h-4 w-4 shrink-0" />
            Featured section limit is 8 books at a time. Remove extra items or keep only the first 8 visible.
          </div>
        )}

        {/* ================= PRODUCT CARDS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-5 items-stretch">
          {visibleBooks.map((book) => {
            const isWishlisted =
              wishlistIds.includes(book.id) || isInWishlist(book.id);
            const isAdded = addedIds.includes(book.id) || isInCart(book.id);

            return (
              <div
                key={book.id}
                onClick={() => handleCardClick(book)}
                className="group relative bg-white rounded-[5px] sm:rounded-[5px] p-3.5 sm:p-4 border border-gray-100/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_30px_-6px_rgba(198,24,33,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none h-full hover:border-[#C61821]/30"
              >
                {/* Subtle Card Background Curved Watermark */}
                <div className="absolute inset-0 rounded-[5px] sm:rounded-[5px] overflow-hidden pointer-events-none -z-0">
                  <div className="absolute top-1/3 right-0 w-28 h-28 bg-red-50/30 rounded-full blur-2xl group-hover:bg-red-100/40 transition-colors" />
                </div>

                {/* --- Top Card Controls (Badge & Wishlist) --- */}
                <div className="relative z-10 flex items-center justify-between w-full h-7 mb-1.5">
                  {book.badge ? (
                    <span className="inline-block bg-[#C61821] text-white text-[9px] sm:text-[9.5px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-2xs">
                      {book.badge}
                    </span>
                  ) : (
                    <span className="inline-block" />
                  )}

                  <button
                    onClick={(e) => handleWishlistClick(book, e)}
                    aria-label="Add to wishlist"
                    className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 p-2 ${
                      isWishlisted
                        ? "bg-red-50 border-red-200 text-[#C61821]"
                        : "bg-white/90 border-gray-200 text-gray-400 hover:border-red-200 hover:text-[#C61821]"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? "fill-current" : "stroke-[1.8]"
                      }`}
                    />
                  </button>
                </div>

                {/* --- Center: Book 3D Mockup Image --- */}
                <div className="relative z-10 w-full h-36 sm:h-40 lg:h-44 flex items-center justify-center my-1 sm:my-2 px-2">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={book.image}
                      alt={book.title}
                      width={320}
                      height={460}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.13)] group-hover:drop-shadow-[0_16px_22px_rgba(198,24,33,0.18)] group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* --- Bottom: Book Details --- */}
                <div className="relative z-10 pt-2 flex flex-col justify-between flex-1">
                  <div>
                    {/* Category Label */}
                    <div className="text-[10.5px] sm:text-[11px] font-extrabold tracking-wider text-[#C61821] uppercase font-sans truncate">
                      {book.examCategory}
                    </div>

                    {/* Book Title */}
                    <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-gray-900 group-hover:text-[#C61821] transition-colors line-clamp-1 mt-0.5 font-sans h-5 flex items-center">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-[11.5px] sm:text-[12px] text-gray-500 line-clamp-1 mt-0.5 font-normal h-4 flex items-center">
                      {book.author}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[12px] font-bold text-gray-900">
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[11.5px] text-gray-400 font-medium">
                        ({book.reviewsCount.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Price & Cart CTA Row */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100/90">
                    <div>
                      {/* Price Numbers */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[17px] sm:text-[19px] font-extrabold text-[#C61821] tracking-tight">
                          ₹{book.price}
                        </span>
                        <span className="text-[12px] text-gray-400 line-through font-medium">
                          ₹{book.originalPrice}
                        </span>
                      </div>

                      {/* Save Tag */}
                      <span className="text-[10.5px] font-bold text-[#C61821] block -mt-0.5">
                        Save {book.discountPercent}%
                      </span>
                    </div>

                    {/* Cart Button */}
                    <button
                      onClick={(e) => handleCartClick(book, e)}
                      aria-label="Add to cart"
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer ${
                        isAdded
                          ? "bg-green-600 text-white scale-105 shadow-green-600/30"
                          : "bg-[#C61821] hover:bg-[#A8131B] text-white shadow-red-600/25 hover:scale-110 active:scale-95"
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.2]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM PAGINATION / CAROUSEL CONTROLS ================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
            {/* Left Chevron */}
            <button
              onClick={handlePrev}
              aria-label="Previous books"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Go to page ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentPage === idx
                      ? "w-2.5 h-2.5 bg-[#C61821] ring-3 ring-red-100"
                      : "w-2 h-2 bg-red-200/80 hover:bg-red-300"
                  }`}
                />
              ))}
            </div>

            {/* Right Chevron */}
            <button
              onClick={handleNext}
              aria-label="Next books"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
