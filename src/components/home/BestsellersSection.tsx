"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookData } from "./HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

export interface BestsellerBook {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  category: string;
  subject?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  edition?: string;
}

export const BESTSELLER_BOOKS: BestsellerBook[] = [
  {
    id: 101,
    title: "Samanya Hindi Evam Vyakaran",
    subtitle: "मध्य प्रदेश लोक सेवा आयोग एवं अन्य राज्य परीक्षाओं हेतु",
    author: "by Mr. Mayank Jagdish Sharma",
    category: "MPPSC",
    subject: "Hindi Grammar",
    price: 900,
    originalPrice: 1000,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 1876,
    badge: "BESTSELLER",
    image: "/images/books/image-2.png",
    edition: "2025-26 Edition",
  },
  {
    id: 102,
    title: "Nibandh Sanhita",
    subtitle: "मुख्य परीक्षा विशेषांक एवं प्रारूप चंद्रिका",
    author: "by Mr. Mayank Jagdish Sharma",
    category: "MPPSC",
    subject: "Essay Writing",
    price: 249,
    originalPrice: 349,
    discountPercent: 29,
    rating: 4.9,
    reviewsCount: 728,
    badge: "BESTSELLER",
    image: "/images/books/image-3.png",
    edition: "2025 Edition",
  },
  {
    id: 103,
    title: "आधुनिक हिन्दी व्याकरण",
    subtitle: "व्याकरण, रचना एवं भाषा चिंतन",
    author: "by Devanagari Publications",
    category: "MPPSC & SI",
    subject: "Hindi Literature",
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
    id: 104,
    title: "MPPSC प्रारंभिक परीक्षा",
    subtitle: "प्रथम प्रश्न पत्र - सामान्य अध्ययन संपूर्ण गाइड",
    author: "by Mr. Shubham Gupta",
    category: "MPPSC",
    subject: "General Studies",
    price: 599,
    originalPrice: 799,
    discountPercent: 25,
    rating: 4.5,
    reviewsCount: 831,
    badge: "BESTSELLER",
    image: "/images/books/image-10.png",
    edition: "2025 Edition",
  },
  {
    id: 105,
    title: "मध्य प्रदेश सामान्य ज्ञान (MP GK)",
    subtitle: "मानचित्र एवं तथ्यात्मक संपूर्ण संकलन",
    author: "by Mr. Mayank Jagdish Sharma",
    category: "MPPSC",
    subject: "MP GK Special",
    price: 389,
    originalPrice: 550,
    discountPercent: 29,
    rating: 4.9,
    reviewsCount: 2890,
    badge: "BESTSELLER",
    image: "/images/books/image-4.png",
    edition: "2025-26 Edition",
  },
  // Slide 2 Books
  {
    id: 106,
    title: "भारतीय न्याय संहिता (BNS 2024)",
    subtitle: "नवीन आपराधिक कानून एवं प्रक्रिया",
    author: "by Devanagari Law Faculty",
    category: "JUDICIARY",
    subject: "Law & IPC",
    price: 449,
    originalPrice: 599,
    discountPercent: 25,
    rating: 4.9,
    reviewsCount: 1650,
    badge: "BESTSELLER",
    image: "/images/books/image-5.png",
    edition: "Latest Criminal Codes",
  },
  {
    id: 107,
    title: "संपूर्ण हिंदी प्रश्न मालिका",
    subtitle: "गत वर्षों के हल प्रश्न पत्र व अभ्यास सेट",
    author: "by Mr. Mayank Jagdish Sharma",
    category: "MPPSC",
    subject: "Hindi PYQ",
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
    id: 108,
    title: "UPSC CSE Prelims Master",
    subtitle: "Comprehensive Prelims Strategy & Solved Papers",
    author: "by Mr. Anand Mishra",
    category: "UPSC",
    subject: "General Studies",
    price: 699,
    originalPrice: 899,
    discountPercent: 22,
    rating: 4.6,
    reviewsCount: 2103,
    badge: "BESTSELLER",
    image: "/images/books/upsc-master.png",
    edition: "2025 Edition",
  },
  {
    id: 109,
    title: "प्रारूप चंद्रिका एवं निबंध विशेषांक",
    subtitle: "शासकीय पत्र व्यवहार एवं निबंध प्रारूप",
    author: "by Mr. Mayank Jagdish Sharma",
    category: "MPPSC",
    subject: "Essay & Drafting",
    price: 219,
    originalPrice: 299,
    discountPercent: 27,
    rating: 4.7,
    reviewsCount: 950,
    badge: "BESTSELLER",
    image: "/images/books/image-9.png",
    edition: "2025 Edition",
  },
  {
    id: 110,
    title: "सामान्य विज्ञान एवं तकनीकी",
    subtitle: "संपूर्ण सामान्य विज्ञान एवं पर्यावरण अध्ययन",
    author: "by Devanagari Academic Team",
    category: "MPPSC & VYAPAM",
    subject: "Science & Tech",
    price: 399,
    originalPrice: 549,
    discountPercent: 27,
    rating: 4.8,
    reviewsCount: 1120,
    badge: "BESTSELLER",
    image: "/images/books/image-11.png",
    edition: "2025-26 Edition",
  },
];

interface BestsellersSectionProps {
  onAddToCart?: (book: BookData) => void;
  onQuickView?: (book: BookData) => void;
  wishlistIds?: Array<number | string>;
  onToggleWishlist?: (book: BookData) => void;
  books?: BestsellerBook[];
}

export default function BestsellersSection({
  onAddToCart,
  onQuickView,
  wishlistIds = [],
  onToggleWishlist,
  books,
}: BestsellersSectionProps) {
  const router = useRouter();
  const { isInCart, isInWishlist, addToCart, toggleWishlist } =
    useCartWishlist();

  const list = books ?? BESTSELLER_BOOKS;
  const BESTSELLER_LIMIT = 10;
  const hasTooManyBooks = list.length > BESTSELLER_LIMIT;

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [addedIds, setAddedIds] = useState<Array<number | string>>([]);

  // Update items per page based on window width for responsive calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(5);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));

  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleBrowseAll = () => {
    router.push("/shop?filter=bestsellers");
  };

  const convertToBookData = (book: BestsellerBook): BookData => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    subject: book.subject || book.category || "General",
    category: book.category || "Competitive Exams",
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

  const handleCartClick = (book: BestsellerBook, e: React.MouseEvent) => {
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

  const handleWishlistClick = (book: BestsellerBook, e: React.MouseEvent) => {
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

  const handleCardClick = (book: BestsellerBook) => {
    if (onQuickView) {
      onQuickView(convertToBookData(book));
    }
  };

  const visibleBooks = list.slice(
    safeCurrentPage * itemsPerPage,
    safeCurrentPage * itemsPerPage + itemsPerPage
  );

  return (
    <section
      id="bestsellers"
      className="relative py-10 sm:py-14 lg:py-16 bg-white overflow-hidden"
    >
      {/* Subtle Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-red-50/40 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[30px] font-bold tracking-tight">
            <span className="text-[#C61821]">Aspirants&apos;</span> <span className="text-gray-900">Most Loved Books</span>
          </h2>
          <button
            onClick={handleBrowseAll}
            className="shrink-0 text-sm font-bold text-[#C61821] inline-flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {hasTooManyBooks && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            <Sparkles className="h-4 w-4 shrink-0" />
            Bestsellers limit is 10 books at a time. Remove extra items or keep only the first 10 visible.
          </div>
        )}

        {/* ================= CAROUSEL WITH LEFT/RIGHT BUTTONS ================= */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous bestsellers"
            className="absolute -left-3 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200/90 text-gray-700 hover:text-[#C61821] hover:border-red-300 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next bestsellers"
            className="absolute -right-3 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200/90 text-gray-700 hover:text-[#C61821] hover:border-red-300 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Cards Grid / Container - 5 Columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5 items-stretch transition-all duration-300">
            {visibleBooks.map((book) => {
              const isWishlisted =
                wishlistIds.includes(book.id) || isInWishlist(book.id);
              const isAdded = addedIds.includes(book.id) || isInCart(book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => handleCardClick(book)}
                  className="group relative bg-white rounded-[5px] sm:rounded-[5px] p-4 sm:p-4.5 border border-gray-100/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_34px_-6px_rgba(198,24,33,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none h-full hover:border-[#C61821]/30"
                >
                  {/* --- Top Card Controls (Badge & Wishlist) --- */}
                  <div className="relative z-10 flex items-center justify-between w-full h-7 mb-1">
                    {book.badge ? (
                      <span className="inline-block bg-[#C61821] text-white text-[9.5px] sm:text-[10px] font-extrabold px-2.5 py-0.5 sm:py-1 rounded-[4px] uppercase tracking-wider shadow-sm">
                        {book.badge}
                      </span>
                    ) : (
                      <span className="inline-block" />
                    )}

                    <button
                      onClick={(e) => handleWishlistClick(book, e)}
                      aria-label="Add to wishlist"
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                        isWishlisted
                          ? "bg-red-50 border-red-200 text-[#C61821]"
                          : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-[#C61821]"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? "fill-current" : "stroke-[1.8]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* --- Center: Book 3D Realistic Cover Image --- */}
                  <div className="relative z-10 w-full h-[192px] sm:h-[216px] lg:h-[238px] flex items-center justify-center my-2 sm:my-3 px-1">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={420}
                        height={600}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)] group-hover:drop-shadow-[0_18px_24px_rgba(198,24,33,0.20)] group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* --- Bottom: Book Details & Pricing --- */}
                  <div className="relative z-10 pt-1 flex flex-col justify-between flex-1">
                    <div>
                      {/* Category Label (MPPSC, etc.) */}
                      <div className="text-[11px] sm:text-[11.5px] font-extrabold tracking-wider text-[#C61821] uppercase font-sans truncate min-h-[16px]">
                        {book.category}
                      </div>

                      {/* Book Title */}
                      <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-gray-900 group-hover:text-[#C61821] transition-colors line-clamp-1 mt-0.5 min-h-[18px] font-sans flex items-center">
                        {book.title}
                      </h3>

                      {/* Author */}
                      <p className="text-[12px] sm:text-[12.5px] text-gray-500 line-clamp-1 mt-1 font-normal h-4 flex items-center">
                        {book.author}
                      </p>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1.5 mt-2">
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

                    {/* Price & Cart Button Row */}
                    <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-gray-100/90">
                      <div>
                        {/* Price Numbers */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[18px] sm:text-[20px] font-extrabold text-gray-900 tracking-tight">
                            ₹{book.price}
                          </span>
                          <span className="text-[12px] text-gray-400 line-through font-medium">
                            ₹{book.originalPrice}
                          </span>
                        </div>

                        {/* Save Tag */}
                        <span className="text-[11px] font-bold text-[#C61821] block -mt-0.5">
                          {book.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Cart Action Button */}
                      <button
                        onClick={(e) => handleCartClick(book, e)}
                        aria-label="Add to cart"
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer ${
                          isAdded
                            ? "bg-green-600 text-white scale-105 shadow-green-600/30"
                            : "bg-[#C61821] hover:bg-[#A8131B] text-white shadow-red-600/25 hover:scale-110 active:scale-95"
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= BOTTOM PAGINATION DOTS ================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentPage === idx
                    ? "w-7 h-2 bg-[#C61821]"
                    : "w-2 h-2 bg-gray-200 hover:bg-red-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
