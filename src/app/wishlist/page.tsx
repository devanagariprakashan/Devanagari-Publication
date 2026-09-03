"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Search,
  Grid,
  List as ListIcon,
  Share2,
  Check,
  BookOpen,
  ArrowUpDown,
  X,
  ChevronRight,
  Flame,
  Truck,
} from "lucide-react";
import { ALL_BOOKS } from "@/data/booksData";
import BookModal from "@/components/home/BookModal";
import { BookData } from "@/components/home/HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

type SortOption = "recent" | "price-low" | "price-high" | "rating" | "savings";
type ViewMode = "grid" | "list";

export default function WishlistPage() {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    moveToCart,
    addToCart,
    clearWishlist,
    isInCart,
    setIsCartDrawerOpen,
    toggleWishlist,
  } = useCartWishlist();

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedBookForModal, setSelectedBookForModal] = useState<BookData | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Merge wishlist items with catalog books for full specifications
  const enrichedWishlist = useMemo(() => {
    return wishlist.map((item) => {
      const catalogBook = ALL_BOOKS.find((b) => b.id === item.id);
      return {
        ...item,
        catalog: catalogBook,
        category: catalogBook?.category || item.category || "Competitive Exams",
        categorySlug: catalogBook?.categorySlug || "exams",
        exam: catalogBook?.exam || "Competitive Exam",
        format: catalogBook?.format || "Standard Edition",
        language: catalogBook?.language || "Hindi",
        inStock: catalogBook ? catalogBook.inStock : true,
        rating: item.rating || catalogBook?.rating || 4.8,
        reviewsCount: item.reviewsCount || catalogBook?.reviewsCount || 120,
        originalPrice: item.originalPrice || catalogBook?.originalPrice || item.price,
        highlights: catalogBook?.highlights || [
          "नवीनतम पाठ्यक्रम 2025-26",
          "विगत वर्षों के हल प्रश्न",
          "परीक्षा उपयोगी अध्ययन सामग्री",
        ],
        description:
          catalogBook?.description ||
          "देवनागरी पब्लिकेशन द्वारा प्रतियोगी परीक्षाओं हेतु मानक एवं प्रामाणिक पुस्तक।",
        isbn: catalogBook?.isbn || "978-93-87654-XX-X",
        pages: catalogBook?.pages || 420,
      };
    });
  }, [wishlist]);

  // Unique categories in the current wishlist
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    enrichedWishlist.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [enrichedWishlist]);

  // Filter & sort
  const filteredWishlist = useMemo(() => {
    let result = [...enrichedWishlist];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.hindiTitle?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.exam?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "savings":
        result.sort((a, b) => {
          const savingsA = (a.originalPrice || a.price) - a.price;
          const savingsB = (b.originalPrice || b.price) - b.price;
          return savingsB - savingsA;
        });
        break;
      case "recent":
      default:
        break;
    }

    return result;
  }, [enrichedWishlist, searchQuery, selectedCategory, sortBy]);

  // Calculations for summary stats
  const totalWishlistValue = useMemo(() => {
    return enrichedWishlist.reduce((acc, item) => acc + item.price, 0);
  }, [enrichedWishlist]);

  const totalOriginalValue = useMemo(() => {
    return enrichedWishlist.reduce(
      (acc, item) => acc + (item.originalPrice || item.price),
      0
    );
  }, [enrichedWishlist]);

  const totalSavings = useMemo(() => {
    return Math.max(0, totalOriginalValue - totalWishlistValue);
  }, [totalOriginalValue, totalWishlistValue]);

  // Handle move all to cart
  const handleMoveAllToCart = () => {
    filteredWishlist.forEach((item) => {
      addToCart(
        {
          id: item.id,
          title: item.title,
          hindiTitle: item.hindiTitle,
          subtitle: item.subtitle,
          author: item.author,
          category: item.category,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          edition: item.edition,
        },
        1,
        false
      );
    });
    setIsCartDrawerOpen(true);
  };

  // Convert to BookData for preview modal
  const openModalForItem = (item: (typeof enrichedWishlist)[0]) => {
    const modalBook: BookData = {
      id: item.id,
      title: item.title,
      subtitle: item.hindiTitle || item.subtitle,
      subject: item.category || "Competitive Exams",
      category: item.category || "General",
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      rating: item.rating || 4.8,
      reviewsCount: item.reviewsCount || 100,
      image: item.image,
      edition: item.edition,
      coverType: "hindi",
      bgColor: "from-[#C61821] to-[#8F0E15]",
      accentColor: "#C61821",
      textColor: "text-white",
      description: item.description,
      highlights: item.highlights,
      isbn: item.isbn,
    };
    setSelectedBookForModal(modalBook);
  };

  // Share Wishlist
  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  // Recommended books (books in catalog that are not currently in the wishlist)
  const recommendedBooks = useMemo(() => {
    const wishlistIds = new Set(wishlist.map((w) => w.id));
    return ALL_BOOKS.filter((b) => !wishlistIds.has(b.id)).slice(0, 4);
  }, [wishlist]);

  return (
    <main className="bg-[#FBFBFC] text-[#1D2129]">
      {/* ======================================================== */}
      {/* 1. BREADCRUMBS & TOP BAR */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C61821] font-semibold">Wishlist</span>
          </nav>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PAGE HERO HEADER */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-[#FBFBFC] border-b border-gray-200/70 py-4 sm:py-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/50 rounded-[5px] blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            {/* Title & Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#C61821] text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
                <Heart className="w-3.5 h-3.5 fill-[#C61821]" />
                <span>My Saved Collection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-3">
                <span className="text-gray-700 text-lg sm:text-2xl font-sans font-bold">My Wishlist</span>
                <span className="inline-flex items-center justify-center w-9 h-9 px-2.5 rounded-full bg-[#C61821] text-white text-xs sm:text-sm font-bold shadow-xs">
                  {wishlistCount}
                </span>
              </h1>
            </div>

            {/* Right side: Filters, Sorters & View Switcher */}
            {wishlist.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Category Filter */}
                {availableCategories.length > 1 && (
                  <div className="flex items-center gap-1 text-xs">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 rounded-[5px] bg-white border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#C61821] cursor-pointer"
                    >
                      <option value="all">All Categories ({wishlist.length})</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-[5px] px-2.5 py-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-xs font-semibold text-gray-700 py-1 focus:outline-hidden cursor-pointer"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="savings">Biggest Discount</option>
                  </select>
                </div>

                {/* View Mode Switcher */}
                <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-[5px] border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-white text-[#C61821] shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white text-[#C61821] shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="List View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(true)}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer ml-auto sm:ml-0 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT BODY */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {wishlist.length === 0 ? (
          /* ======================================================== */
          /* EMPTY STATE */
          /* ======================================================== */
          <div className="py-3 sm:py-4">
            <div className="max-w-md mx-auto text-center bg-white rounded-[5px] p-6 sm:p-8 border border-gray-200/80 shadow-sm relative overflow-hidden">
              {/* Heart Pulse Icon */}
              <div className="relative mx-auto w-16 h-16 rounded-full bg-red-50 text-[#C61821] flex items-center justify-center mb-3">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
                 Your wishlist is empty.
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Click the heart (❤️) icon on any book to save it here.
              </p>

              {/* Primary CTA button */}
              <div className="mt-6 flex justify-center">
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Books</span>
                </Link>
              </div>
            </div>
            
          </div>
        ) : (
          /* ======================================================== */
          /* POPULATED WISHLIST STATE */
          /* ======================================================== */
          <div className="space-y-6">
            {/* Active Category Badges if filtered */}
            {selectedCategory !== "all" && (
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <span>Filtered by:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-[#C61821] font-bold">
                  {selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}

            {/* PRODUCT CARDS: GRID VIEW */}
            {filteredWishlist.length === 0 ? (
              <div className="bg-white rounded-[5px] border border-gray-200 p-8 text-center">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800">No matching books found</h4>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or category filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                >
                  Reset Search
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredWishlist.map((item) => {
                  const discount = item.originalPrice
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0;
                  const alreadyInCart = isInCart(item.id);

                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-[5px] border border-gray-200/90 hover:border-red-200/90 shadow-2xs hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Media & Tags */}
                      <div className="p-3 pb-0">
                        <div className="relative aspect-[4/3] bg-gradient-to-b from-gray-50 to-gray-100/60 rounded-[5px] p-2 flex items-center justify-center overflow-hidden border border-gray-100 mb-2">
                          {/* Discount Pill */}
                          {discount > 0 && (
                            <span className="absolute top-2.5 left-2.5 z-10 bg-[#C61821] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                              {discount}% OFF
                            </span>
                          )}

                          {/* Book Image */}
                          <img
                            src={item.image || "/images/books/image-2.png"}
                            alt={item.title}
                            className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Action Buttons Top-Right */}
                          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
                            {/* Remove from Wishlist */}
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(item.id)}
                              aria-label="Remove from wishlist"
                              className="w-8 h-8 rounded-full bg-white/95 hover:bg-rose-50 text-gray-400 hover:text-red-600 shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Quick Preview Modal */}
                            <button
                              type="button"
                              onClick={() => openModalForItem(item)}
                              aria-label="Quick Preview"
                              className="w-8 h-8 rounded-full bg-white/95 hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Category & Edition */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-extrabold text-[#C61821] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          {item.edition && (
                            <span className="text-[10.5px] text-gray-400 font-medium truncate max-w-[120px]">
                              {item.edition}
                            </span>
                          )}
                        </div>

                        {/* Title & Hindi Title */}
                        <h3 className="font-bold text-[17px] text-gray-900 leading-snug line-clamp-1 group-hover:text-[#C61821] transition-colors">
                          {item.title}
                        </h3>
                        {item.hindiTitle && (
                          <p className="text-xs text-gray-500 font-devanagari line-clamp-1 mt-0.5 font-medium">
                            {item.hindiTitle}
                          </p>
                        )}

                        {/* Author */}
                        <p className="text-xs text-gray-400 mt-1 font-medium">{item.author || "Devanagari Publications"}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mt-2">
                          <div className="flex items-center">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </div>
                          <span>{item.rating}</span>
                          <span className="text-gray-400 font-normal">({item.reviewsCount})</span>
                          <span className="text-gray-300 ml-auto">•</span>
                          <span className="text-emerald-600 font-semibold text-[11px]">In Stock</span>
                        </div>
                      </div>

                      {/* Card Footer: Price & CTA */}
                      <div className="p-4 pt-3 mt-3 border-t border-gray-100 bg-gray-50/40">
                        <div className="flex items-baseline justify-between mb-3">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-gray-900">₹{item.price}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                            )}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-[11px] font-bold text-emerald-600">
                              Save ₹{item.originalPrice - item.price}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {alreadyInCart ? (
                            <button
                              type="button"
                              onClick={() => setIsCartDrawerOpen(true)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>In Cart (View)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => moveToCart(item.id)}
                              className="flex-1 py-2.5 px-3 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Move to Cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* PRODUCT CARDS: LIST VIEW */
              <div className="space-y-4">
                {filteredWishlist.map((item) => {
                  const discount = item.originalPrice
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0;
                  const alreadyInCart = isInCart(item.id);

                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-[5px] border border-gray-200/90 hover:border-red-200 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                    >
                      {/* Left: Book Cover + Info */}
                      <div className="flex gap-4 items-start flex-1 min-w-0">
                        {/* Book Image */}
                        <div className="w-24 sm:w-28 aspect-[4/5] shrink-0 bg-gray-50/50 rounded-[5px] p-2 sm:p-3 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                          {discount > 0 && (
                            <span className="absolute top-0 left-0 bg-[#C61821] text-white text-[10px] font-extrabold px-2 py-1 rounded-br-[5px] shadow-xs z-10">
                              {discount}%
                            </span>
                          )}
                          <img
                            src={item.image || "/images/books/image-2.png"}
                            alt={item.title}
                            className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300 relative z-0"
                          />
                        </div>

                        {/* Book Info */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold text-[#C61821] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">• {item.exam}</span>
                            <span className="text-[11px] text-gray-400">• {item.format}</span>
                          </div>

                          <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-snug group-hover:text-[#C61821] transition-colors">
                            {item.title}
                          </h3>

                          {item.hindiTitle && (
                            <p className="text-xs sm:text-sm text-gray-600 font-devanagari font-medium">
                              {item.hindiTitle}
                            </p>
                          )}

                          <p className="text-xs text-gray-500 font-medium">
                            By <span className="text-gray-800 font-semibold">{item.author || "Devanagari Publications"}</span>
                          </p>

                          {/* Highlights preview */}
                          {item.highlights && item.highlights.length > 0 && (
                            <div className="hidden md:flex flex-wrap gap-1.5 pt-1">
                              {item.highlights.slice(0, 3).map((h, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10.5px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100"
                                >
                                  ✓ {h}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Rating & Stock */}
                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{item.rating}</span>
                              <span className="text-gray-400 font-normal">({item.reviewsCount} reviews)</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              In Stock
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="w-full sm:w-auto shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 self-stretch sm:self-center">
                        <div className="text-left sm:text-right">
                          <div className="flex items-baseline sm:justify-end gap-2">
                            <span className="text-xl font-extrabold text-gray-900">₹{item.price}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                            )}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs font-bold text-emerald-600 block">
                              You Save ₹{item.originalPrice - item.price} ({discount}%)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openModalForItem(item)}
                            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {alreadyInCart ? (
                            <button
                              type="button"
                              onClick={() => setIsCartDrawerOpen(true)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>In Cart</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => moveToCart(item.id)}
                              className="px-4 py-2.5 rounded-[5px] bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Move to Cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. CLEAR WISHLIST CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#C61821] flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">
              Clear Entire Wishlist?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
              Are you sure you want to remove all {wishlistCount} saved books from your wishlist? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearWishlist();
                  setIsClearModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. BOOK PREVIEW MODAL */}
      {/* ======================================================== */}
      <BookModal
        book={selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
      />
    </main>
  );
}
