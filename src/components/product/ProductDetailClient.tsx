"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Languages,
  FileText,
  Bookmark,
  Truck,
  ShieldCheck,
  Tag,
  Inbox,
  Calendar,
  Layers,
  Edit3,
  Target,
  Sparkles,
  Maximize2,
  Minus,
  Plus,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { ALL_BOOKS, BookItem } from "@/data/booksData";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";
import SampleReaderModal from "@/components/product/SampleReaderModal";

interface ProductDetailClientProps {
  id?: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const router = useRouter();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    isInCart,
    setIsCartDrawerOpen,
  } = useCartWishlist();

  // Find book by id or fallback to Nibandh Sanhita (id: 102)
  const book: BookItem = useMemo(() => {
    if (!id) {
      return ALL_BOOKS.find((b) => b.id === 102) || ALL_BOOKS[0];
    }
    const numericId = parseInt(id, 10);
    const found = !isNaN(numericId)
      ? ALL_BOOKS.find((b) => b.id === numericId)
      : ALL_BOOKS.find(
          (b) =>
            b.title.toLowerCase().includes(id.toLowerCase()) ||
            b.categorySlug === id,
        );
    return found || ALL_BOOKS.find((b) => b.id === 102) || ALL_BOOKS[0];
  }, [id]);

  // Gallery items
  const galleryItems = useMemo(() => {
    const items = [
      {
        id: "cover",
        title: "Front Cover",
        image: book.image || "/images/books/image-3.png",
      },
      {
        id: "sample-1",
        title: "विषय सूची (Table of Contents)",
        image: "/images/books/sample-page-1.svg",
      },
      {
        id: "sample-2",
        title: "आदर्श निबंध प्रारूप (Model Essay)",
        image: "/images/books/sample-page-2.svg",
      },
      {
        id: "sample-3",
        title: "विगत वर्ष प्रश्न (PYQ Analysis)",
        image: "/images/books/sample-page-3.svg",
      },
    ];
    return items;
  }, [book]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleModalInitialPage, setSampleModalInitialPage] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const isWishlisted = isInWishlist(book.id);
  const isCarted = isInCart(book.id);

  // Related books from same category/exam (up to 4 items)
  const relatedBooks = useMemo(() => {
    const primary = ALL_BOOKS.filter(
      (b) =>
        b.id !== book.id &&
        (b.category === book.category || b.exam === book.exam),
    );
    if (primary.length >= 4) return primary.slice(0, 4);
    const fallback = ALL_BOOKS.filter(
      (b) => b.id !== book.id && !primary.some((p) => p.id === b.id),
    );
    return [...primary, ...fallback].slice(0, 4);
  }, [book]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: book.id,
        title: book.title,
        hindiTitle: book.hindiTitle,
        subtitle: book.subtitle,
        author: book.author,
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
        coverType: "paperback",
      },
      quantity,
      false,
    );
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: book.id,
        title: book.title,
        hindiTitle: book.hindiTitle,
        subtitle: book.subtitle,
        author: book.author,
        category: book.category,
        price: book.price,
        originalPrice: book.originalPrice,
        image: book.image,
        edition: book.edition,
        coverType: "paperback",
      },
      quantity,
      false,
    );
    router.push("/cart");
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: book.id,
      title: book.title,
      hindiTitle: book.hindiTitle,
      subtitle: book.subtitle,
      author: book.author,
      category: book.category,
      price: book.price,
      originalPrice: book.originalPrice,
      image: book.image,
      edition: book.edition,
      rating: book.rating,
      reviewsCount: book.reviewsCount,
      coverType: "paperback",
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const openSampleModal = (pageIndex: number = 0) => {
    setSampleModalInitialPage(pageIndex);
    setIsSampleModalOpen(true);
  };

  // Highlights list
  const highlightsList = book.featureHighlights || [
    {
      title: "250+ निबंध संग्रह",
      subtitle: "विविध विषयों पर विस्तृत निबंध",
      icon: "inbox",
    },
    {
      title: "अद्यतन आंकड़े",
      subtitle: "2025 तक के नवीनतम आंकड़े",
      icon: "calendar",
    },
    {
      title: "समसामयिक विषय",
      subtitle: "वर्तमान घटनाओं का समावेश",
      icon: "layers",
    },
    {
      title: "सरल व प्रभावशाली लेखन",
      subtitle: "सरल भाषा में बेहतर अंक के लिए",
      icon: "edit",
    },
    {
      title: "परीक्षा दृष्टिकोण",
      subtitle: "MPPSC परीक्षा के पैटर्न के अनुसार",
      icon: "target",
    },
    {
      title: "परीक्षा उपयोगी संग्रह",
      subtitle: "त्वरित पुनरावृत्ति के लिए सर्वश्रेष्ठ",
      icon: "star",
    },
  ];

  // Helper to render highlight icons
  const renderHighlightIcon = (iconName?: string) => {
    switch (iconName) {
      case "inbox":
        return <Inbox size={18} />;
      case "calendar":
        return <Calendar size={18} />;
      case "layers":
        return <Layers size={18} />;
      case "edit":
        return <Edit3 size={18} />;
      case "target":
        return <Target size={18} />;
      case "star":
      default:
        return <Star size={18} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFC] text-[#1D2129] pb-24 lg:pb-16 pt-3 sm:pt-5">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* ============================================================ */}
        {/* BREADCRUMBS NAVIGATION                                       */}
        {/* ============================================================ */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-stone-500 mb-5 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-none py-1"
        >
          <Link
            href="/"
            className="hover:text-stone-900 transition-colors font-medium flex items-center gap-1"
          >
            Home
          </Link>
          <ChevronRight size={14} className="text-stone-400 shrink-0" />
          <Link
            href={`/shop?category=${book.categorySlug || "mppsc"}`}
            className="hover:text-stone-900 transition-colors font-medium"
          >
            {book.category || "MPPSC"}
          </Link>
          <ChevronRight size={14} className="text-stone-400 shrink-0" />
          <Link
            href={`/shop?category=${book.categorySlug || "mppsc"}&exam=${book.examSlug || "mppsc"}`}
            className="hover:text-stone-900 transition-colors font-medium"
          >
            {book.exam || "MPPSC Prarambhik Pariksha"}
          </Link>
          <ChevronRight size={14} className="text-stone-400 shrink-0" />
          <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {book.title}
          </span>
        </nav>

        {/* ============================================================ */}
        {/* MAIN TOP SECTION (GALLERY + INFO + BUY BOX)                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ---------------------------------------------------------- */}
          {/* COLUMN 1: IMAGE GALLERY (5 cols)                           */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            {/* Thumbnails vertical bar on desktop, horizontal on mobile with Top & Bottom arrows */}
            <div className="flex md:flex-col items-center gap-1.5 sm:gap-2 shrink-0 w-full md:w-auto">
              {/* Top / Prev Arrow */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="w-[25px] h-[70px] sm:w-8 sm:h-8 md:w-full md:h-7 rounded-[5px] border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 hover:text-[#C61821] flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer active:scale-90"
                aria-label="Previous image"
              >
                <ChevronUp size={16} className="hidden md:block" />
                <ChevronLeft size={16} className="block md:hidden" />
              </button>

              {/* Thumbnails list */}
              <div className="flex md:flex-col gap-2 sm:gap-2.5 overflow-x-auto md:overflow-visible py-1.5 px-1 scrollbar-none max-w-[calc(100vw-80px)] md:max-w-none items-center">
                {galleryItems.map((item, idx) => {
                  const isActive = activeImageIndex === idx;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-[62px] h-[78px] sm:w-[72px] sm:h-[88px] md:w-20 md:h-[92px] rounded-[5px] bg-white transition-all cursor-pointer shrink-0 p-1 flex items-center justify-center box-border ${
                        isActive
                          ? "border-2 border-[#C61821] shadow-sm ring-1 ring-[#C61821]/25"
                          : "border border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100"
                      }`}
                      title={item.title}
                    >
                      <div className="w-full h-full relative rounded-[3px] overflow-hidden bg-stone-50 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom / Next Arrow */}
              <button
                type="button"
                onClick={handleNextImage}
                className="w-[25px] h-[70px] sm:w-8 sm:h-8 md:w-full md:h-7 rounded-[5px] border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 hover:text-[#C61821] flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer active:scale-90"
                aria-label="Next image"
              >
                <ChevronDown size={16} className="hidden md:block" />
                <ChevronRight size={16} className="block md:hidden" />
              </button>
            </div>

            {/* Main Image Showcase Container */}
            <div className="flex-1 relative rounded-[5px] bg-[#FCF6F6] p-4 sm:p-6 md:p-8 flex items-center justify-center border border-rose-100/70 shadow-sm min-h-[280px] sm:min-h-[350px] md:min-h-[440px] overflow-hidden group w-full">
              {/* Bestseller Badge */}
              <div className="absolute top-2.5 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-[5px] bg-[#C61821] text-white text-[11px] sm:text-xs font-bold shadow-sm tracking-wide">
                  {book.badge || "Bestseller"}
                </span>
              </div>

              {/* Wishlist Quick Toggle Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-2.5 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                  isWishlisted
                    ? "bg-red-50 text-[#C61821] border border-red-200 scale-110"
                    : "bg-white/90 text-stone-600 hover:text-[#C61821] border border-stone-200 hover:bg-white"
                }`}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={17}
                  className={
                    isWishlisted ? "fill-[#C61821] text-[#C61821]" : ""
                  }
                />
              </button>

              {/* Navigation Arrows on Main Showcase Image */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#C61821] flex items-center justify-center shadow-sm border border-stone-200 transition-all opacity-80 hover:opacity-100 cursor-pointer active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#C61821] flex items-center justify-center shadow-sm border border-stone-200 transition-all opacity-80 hover:opacity-100 cursor-pointer active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>

              {/* Lightbox / Zoom Trigger */}
              <button
                type="button"
                onClick={() => openSampleModal(activeImageIndex)}
                className="absolute bottom-3 right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-sm border border-stone-200 opacity-80 hover:opacity-100 transition-opacity"
                title="Enlarge preview"
              >
                <Maximize2 size={14} />
              </button>

              {/* Center Book / Page Image */}
              <div
                className="relative max-h-[250px] sm:max-h-[310px] md:max-h-[380px] w-full flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                onClick={() => openSampleModal(activeImageIndex)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryItems[activeImageIndex]?.image || book.image}
                  alt={book.title}
                  className="max-h-[240px] sm:max-h-[300px] md:max-h-[370px] w-auto object-contain rounded-lg drop-shadow-[0_14px_20px_rgba(0,0,0,0.14)] select-none"
                />
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* COLUMN 2: PRODUCT INFO, SPECS & BUY BOX (7 cols)           */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Category / Exam Red Tag */}
            <span className="text-xs font-bold text-[#C61821] uppercase tracking-wider mb-1.5 block">
              {book.category || "MPPSC"}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight mb-2">
              {book.title}
            </h1>

            {/* Author */}
            <div className="text-sm text-stone-600 mb-3">
              <span>by </span>
              <Link
                href={`/shop?search=${encodeURIComponent(book.author)}`}
                className="text-[#C61821] font-semibold hover:underline"
              >
                {book.author || "Mr. Mayank Jagdish Sharma"}
              </Link>
            </div>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-2 text-sm text-stone-600 flex-wrap">
              <div className="flex items-center gap-1 font-bold text-stone-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                <span>{book.rating || 4.9}</span>
                <span className="text-stone-500 font-normal">
                  ({book.reviewsCount || 728})
                </span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500">
                {book.reviewsCount || 728} reviews
              </span>
            </div>

            {/* BUY BOX CARD (Positioned directly under Product Info)    */}
            <div className="mt-2 p-2 sm:p-3">
              {/* Top: Price & Stock Status */}
              <div className="flex flex-row items-center justify-between gap-3 pb-2 border-b border-stone-100">
                <div>
                  <div className="flex items-baseline flex-wrap gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#C61821] tracking-tight">
                      ₹{book.price}
                    </span>
                    {book.originalPrice && book.originalPrice > book.price && (
                      <>
                        <span className="text-base text-stone-400 line-through font-medium">
                          ₹{book.originalPrice}
                        </span>
                        <span className="bg-rose-50 text-[#C61821] text-xs font-bold px-2 py-0.5 rounded-md border border-rose-100">
                          {book.discountPercent ||
                            Math.round(
                              ((book.originalPrice - book.price) /
                                book.originalPrice) *
                                100,
                            )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50/80 px-3 py-1.5 rounded-[5px] border border-emerald-100 w-fit">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-[5px] bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-[5px] h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>In Stock</span>
                </div>
              </div>

              {/* Middle: Quantity Selector + Add to Cart + Buy Now */}
              <div className="pt-3.5 sm:pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between border border-stone-200 rounded-[5px] px-3 py-1.5 w-full sm:w-32 bg-stone-50/60 shrink-0">
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer rounded-[4px] hover:bg-stone-200/60 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-stone-900 text-[15px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer rounded-[4px] hover:bg-stone-200/60 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Primary Add to Cart & Secondary Buy Now */}
                <div className="grid grid-cols-2 sm:flex sm:flex-1 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3 sm:py-3.5 px-3 sm:px-4 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-red-600/15 active:scale-[0.98] transition-all cursor-pointer text-center"
                  >
                    <ShoppingCart size={16} className="shrink-0" />
                    <span className="truncate">{isCarted ? "Add More" : "Add to Cart"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3 sm:py-3.5 px-3 sm:px-4 rounded-[5px] bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-all cursor-pointer text-center"
                  >
                    <Zap size={16} className="text-stone-700 shrink-0" />
                    <span className="truncate">Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Bottom: Wishlist + Share Micro Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="flex items-center gap-1.5 hover:text-[#C61821] transition-colors"
                >
                  <Heart
                    size={15}
                    className={
                      isWishlisted ? "fill-[#C61821] text-[#C61821]" : ""
                    }
                  />
                  <span>
                    {isWishlisted ? "Wishlisted" : "Save to Wishlist"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check size={15} className="text-emerald-600" />
                      <span className="text-emerald-600 font-medium">
                        Link Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 size={15} />
                      <span>Share Book</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Short Tagline / Hindi Summary */}
            <p className="text-sm text-stone-600 leading-relaxed mb-2 font-normal">
              {book.shortSummary ||
                `'${book.title}' MPPSC प्रारंभिक एवं मुख्य परीक्षा के लिए निबंध लेखन की सर्वोत्तम पुस्तक। 250+ निबंध, समसामयिक विषय और अद्यतन आँकड़ों के साथ।`}
            </p>

            {/* 4 Quick Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
              {/* Edition */}
              <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-[5px] bg-stone-50/80 border border-stone-200/70">
                <div className="w-8 h-8 rounded-[5px] bg-rose-50 text-[#C61821] flex items-center justify-center shrink-0 border border-rose-100">
                  <BookOpen size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-stone-400 font-[500]">
                    Edition
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate mt-0.5">
                    {book.edition?.includes("2025")
                      ? "2025"
                      : book.edition || "2025"}
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-[5px] bg-stone-50/80 border border-stone-200/70">
                <div className="w-8 h-8 rounded-[5px] bg-rose-50 text-[#C61821] flex items-center justify-center shrink-0 border border-rose-100">
                  <Languages size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-stone-400 font-[500]">
                    Language
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate mt-0.5">
                    {book.language || "Hindi"}
                  </div>
                </div>
              </div>

              {/* Pages */}
              <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-[5px] bg-stone-50/80 border border-stone-200/70">
                <div className="w-8 h-8 rounded-[5px] bg-rose-50 text-[#C61821] flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-stone-400 font-[500]">
                    Pages
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate mt-0.5">
                    {book.pages || 456}
                  </div>
                </div>
              </div>

              {/* Binding */}
              <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-[5px] bg-stone-50/80 border border-stone-200/70">
                <div className="w-8 h-8 rounded-[5px] bg-rose-50 text-[#C61821] flex items-center justify-center shrink-0 border border-rose-100">
                  <Bookmark size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-stone-400 font-[500]">
                    Binding
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate mt-0.5">
                    {book.binding || "Paperback"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM TWO-COLUMN SECTION                                    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 mt-10 sm:mt-12">
          {/* ---------------------------------------------------------- */}
          {/* CARD 1: ABOUT THE BOOK (7 cols)                            */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white rounded-[8px] border border-stone-200/90 p-4 sm:p-5 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mb-3">
              About the Book
            </h2>

            {/* Extended Description Paragraph */}
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
              {book.description ||
                `'${book.title}' MPPSC प्रारंभिक एवं मुख्य परीक्षा के लिए निबंध लेखन की एक अत्यंत उपयोगी पुस्तक है। इसमें 250+ निबंधों का संग्रह है जो विभिन्न विषयों को कवर करते हैं। पुस्तक में समसामयिक घटनाओं, आंकड़े और तथ्यों को शामिल किया गया है जो आपके निबंध को और अधिक प्रभावशाली बनाते हैं।`}
            </p>

            {/* 6 Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlightsList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3 border border-stone-100 hover:border-rose-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/80 flex items-center justify-center text-[#C61821] shrink-0">
                    {renderHighlightIcon(item.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* CARD 2: PRODUCT DETAILS & TRUST PROMOS (5 cols)            */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white rounded-[5px] border border-stone-200/90 p-3 sm:p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mb-5">
                Product Details
              </h2>
    
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                 {/* 1 Table / Key-Value List */}
              <div className="lg:col-span-7 divide-y divide-stone-100 text-sm mb-3">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Book Name</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.title}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Author</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.author || "Mr. Mayank Jagdish Sharma"}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">
                    Publication
                  </span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.publication || "Dnyanagari Prakashan"}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Edition</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.edition || "2025 (Latest Edition)"}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Language</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.language || "Hindi"}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Pages</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.pages || 456}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Binding</span>
                  <span className="text-stone-900 font-semibold text-right">
                    {book.binding || "Paperback"}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">ISBN</span>
                  <span className="text-stone-900 font-semibold text-right font-mono text-xs sm:text-sm">
                    {book.isbn || "978-93-12345-678-9"}
                  </span>
                </div>
              </div>

              {/* 2 Trust & Coupon Cards */}
              <div className="lg:col-span-5 space-y-3 pt-2 ">
                {/* Free Delivery */}
                <div className=" flex items-center gap-3.5 p-2 rounded-[5px] bg-[#F4FAF7] border border-[#D8F0E5]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      Free Delivery
                    </div>
                    <div className="text-xs text-stone-500">
                      On orders above ₹499
                    </div>
                  </div>
                </div>

                {/* Promo Coupon */}
                <div className="flex items-center gap-3.5 p-2 rounded-[5px] bg-[#FFF5F5] border border-[#FFE0E0]">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C61821] flex items-center justify-center shrink-0">
                    <Tag size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      Use code{" "}
                      <span className="text-[#C61821] font-black">READ20</span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Get extra 20% off
                    </div>
                  </div>
                </div>

                {/* Secure Packaging */}
                <div className="flex items-center gap-3.5 p-2 rounded-[5px] bg-[#F4F7FC] border border-[#DCE6F8]">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      Secure Packaging
                    </div>
                    <div className="text-xs text-stone-500">
                      100% safe delivery
                    </div>
                  </div>
                </div>
              </div>
             </div> 

            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RELATED BOOKS SECTION                                        */}
        {/* ============================================================ */}
        {relatedBooks.length > 0 && (
          <section className="mt-14 sm:mt-18">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                  Related Competitive Exam Books
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Frequently purchased together with {book.title}
                </p>
              </div>
              <Link
                href={`/shop?category=${book.categorySlug || "all"}`}
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#C61821] hover:text-[#8F0E15]"
              >
                View all in {book.category} <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedBooks.map((item) => {
                const itemWishlisted = isInWishlist(item.id);
                const discount =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100,
                      )
                    : null;

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group bg-white rounded-[8px] sm:rounded-[10px] border border-stone-200/90 hover:border-[#C61821]/40 p-2.5 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between relative"
                  >
                    <div>
                      {/* Top Bar: Badge & Wishlist Heart */}
                      <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#C61821] text-white text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-xs">
                          {item.badge || "BESTSELLER"}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(item);
                          }}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                            itemWishlisted
                              ? "bg-red-50 border-red-200 text-[#C61821]"
                              : "border-stone-200 bg-white text-stone-400 hover:text-[#C61821] hover:border-stone-300"
                          }`}
                          title={
                            itemWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            size={12}
                            className={
                              itemWishlisted
                                ? "fill-[#C61821] text-[#C61821]"
                                : ""
                            }
                          />
                        </button>
                      </div>

                      {/* 3D Book Cover Center Image (Compact Height) */}
                      <div className="relative h-32 sm:h-40 md:h-44 w-full flex items-center justify-center my-1.5 sm:my-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full w-auto object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.16)] group-hover:scale-[1.03] transition-transform duration-300 select-none"
                        />
                      </div>

                      {/* Exam / Category Red Tag */}
                      <span className="text-[9px] sm:text-[11px] font-black text-[#C61821] uppercase tracking-wider block mb-0.5">
                        {item.exam || item.category || "MPPSC"}
                      </span>

                      {/* Title */}
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#C61821] transition-colors">
                        {item.title}
                      </h4>

                      {/* Author */}
                      <p className="text-[10px] sm:text-xs text-stone-500 line-clamp-1 mt-0.5">
                        by {item.author || "Mr. Mayank Jagdish Sharma"}
                      </p>

                      {/* Rating Row */}
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400 shrink-0"
                        />
                        <span className="font-bold text-stone-900 text-[10px] sm:text-xs">
                          {item.rating || 4.9}
                        </span>
                        <span className="text-stone-400 text-[9px] sm:text-[10px]">
                          ({item.reviewsCount || 728})
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pricing & Circular Cart Button */}
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      <div>
                        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                          <span className="text-base sm:text-xl font-black text-stone-900 tracking-tight">
                            ₹{item.price}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-[10px] sm:text-xs text-stone-400 line-through font-medium">
                                ₹{item.originalPrice}
                              </span>
                            )}
                        </div>
                        {discount ? (
                          <span className="text-[9px] sm:text-[11px] font-bold text-[#C61821] block leading-tight">
                            Save {discount}%
                          </span>
                        ) : null}
                      </div>

                      {/* Red Floating Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item, 1, false);
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C61821] hover:bg-[#8F0E15] text-white flex items-center justify-center shadow-md shadow-red-600/25 active:scale-95 transition-all shrink-0 cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ============================================================ */}
      {/* MOBILE STICKY ACTION BAR (Visible on small screens)          */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-[#C61821]">
              ₹{book.price}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{book.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">
            ● In Stock
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-[5px] bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Zap size={15} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULLSCREEN SAMPLE READER MODAL                               */}
      {/* ============================================================ */}
      <SampleReaderModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        title={book.title}
        pages={galleryItems}
        initialPageIndex={sampleModalInitialPage}
      />
    </main>
  );
}
