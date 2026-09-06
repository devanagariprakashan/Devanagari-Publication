"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  CheckCircle2,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
  Flame,
  Truck,
  ShieldCheck,
  BookOpen,
  ArrowUpDown,
  Check,
  Layers,
  Award,
} from "lucide-react";
import {
  ALL_BOOKS,
  BookItem,
  SHOP_CATEGORIES,
  SHOP_FORMATS,
  SHOP_LANGUAGES,
  SHOP_AUTHORS,
} from "@/data/booksData";
import { fetchCatalogBooks } from "@/lib/catalog";
import BookModal from "@/components/home/BookModal";
import { BookData } from "@/components/home/HeroBook3D";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    cart,
    wishlist,
    addToCart,
    toggleWishlist,
    isInCart,
    isInWishlist,
    setIsCartDrawerOpen,
    setIsWishlistDrawerOpen,
  } = useCartWishlist();

  const [catalogBooks, setCatalogBooks] = useState<BookItem[]>(ALL_BOOKS);

  useEffect(() => {
    let active = true;
    fetchCatalogBooks()
      .then((books) => {
        if (!active) return;
        setCatalogBooks(books.length > 0 ? books : ALL_BOOKS);
      })
      .catch(() => {
        if (active) setCatalogBooks(ALL_BOOKS);
      });

    return () => {
      active = false;
    };
  }, []);

  // URL query params
  const paramCategory = searchParams.get("category") || "all";
  const paramSearch = searchParams.get("search") || "";
  const paramFilter = searchParams.get("filter") || "";
  const paramExam = searchParams.get("exam") || "";
  const paramLanguage = searchParams.get("language") || "";
  const paramMinPrice = searchParams.get("minPrice");
  const paramMaxPrice = searchParams.get("maxPrice");
  const paramView = searchParams.get("view") || "";

  // State
  const [searchQuery, setSearchQuery] = useState(paramSearch);
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    paramLanguage ? [paramLanguage] : []
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(
    paramMinPrice ? Number(paramMinPrice) : 0
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    paramMaxPrice ? Number(paramMaxPrice) : 1000
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(paramFilter === "bestsellers");
  const [newReleaseOnly, setNewReleaseOnly] = useState(paramFilter === "new");
  const [offersOnly, setOffersOnly] = useState(paramFilter === "offers" || paramFilter === "featured");
  const [wishlistOnly, setWishlistOnly] = useState(paramView === "wishlist" || paramFilter === "wishlist");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedBookForModal, setSelectedBookForModal] = useState<BookData | null>(null);

  // Sync URL changes to state
  useEffect(() => {
    if (paramCategory) setSelectedCategory(paramCategory);
    if (paramSearch) setSearchQuery(paramSearch);
    if (paramLanguage) setSelectedLanguages([paramLanguage]);
    if (paramMinPrice) setMinPrice(Number(paramMinPrice));
    else if (!paramMinPrice) setMinPrice(0);
    if (paramMaxPrice) setMaxPrice(Number(paramMaxPrice));
    if (paramFilter === "bestsellers") setBestsellerOnly(true);
    if (paramFilter === "new") setNewReleaseOnly(true);
    if (paramFilter === "offers" || paramFilter === "featured") setOffersOnly(true);
    if (paramView === "wishlist" || paramFilter === "wishlist") setWishlistOnly(true);
    if (paramView === "cart") {
      setIsCartDrawerOpen(true);
    }
  }, [paramCategory, paramSearch, paramFilter, paramLanguage, paramMinPrice, paramMaxPrice, paramView, setIsCartDrawerOpen]);

  // Lock body scroll and pause Lenis when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.start();
        }
      };
    }
  }, [isMobileFilterOpen]);

  const handleAddToCart = (book: BookItem) => {
    addToCart({
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
    });
  };

  const handleToggleWishlist = (book: BookItem) => {
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
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedAuthors([]);
    setMaxPrice(1000);
    setInStockOnly(false);
    setBestsellerOnly(false);
    setNewReleaseOnly(false);
    setOffersOnly(false);
    setWishlistOnly(false);
    setSortBy("featured");
    router.push("/shop");
  };

  // Convert BookItem to BookData for the shared modal
  const openModalForBook = (book: BookItem) => {
    const modalBook: BookData = {
      id: book.id,
      title: book.title,
      author: book.author,
      subtitle: book.subtitle || book.description,
      category: book.category,
      subject: book.subject || book.exam,
      price: book.price,
      originalPrice: book.originalPrice,
      rating: book.rating,
      reviewsCount: book.reviewsCount,
      image: book.image,
      edition: book.edition,
      coverType: "law",
      bgColor: "from-[#C61821] to-[#8F0E15]",
      accentColor: "#C61821",
      textColor: "text-white",
      description: book.description,
      highlights: book.highlights || [],
      isbn: book.isbn,
    };
    setSelectedBookForModal(modalBook);
  };

  // Filter & Sort Logic
  const filteredBooks = useMemo(() => {
    return catalogBooks.filter((book) => {
      // Wishlist only filter
      if (wishlistOnly && !wishlist.some((w) => String(w.id) === String(book.id))) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && book.categorySlug !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesHindi = book.hindiTitle?.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesSubject = book.subject?.toLowerCase().includes(query);
        const matchesExam = book.exam.toLowerCase().includes(query);
        if (!matchesTitle && !matchesHindi && !matchesAuthor && !matchesSubject && !matchesExam) {
          return false;
        }
      }

      // Formats filter
      if (selectedFormats.length > 0 && !selectedFormats.includes(book.format)) {
        return false;
      }

      // Languages filter
      if (selectedLanguages.length > 0 && !selectedLanguages.includes(book.language)) {
        return false;
      }

      // Authors filter
      if (selectedAuthors.length > 0 && !selectedAuthors.includes(book.author)) {
        return false;
      }

      // Price filter
      if (book.price > maxPrice) {
        return false;
      }
      if (minPrice > 0 && book.price < minPrice) {
        return false;
      }

      // In stock
      if (inStockOnly && !book.inStock) {
        return false;
      }

      // Bestseller only
      if (bestsellerOnly && !book.isBestseller) {
        return false;
      }

      // New release only
      if (newReleaseOnly && !book.isNewRelease) {
        return false;
      }

      // Offers only
      if (offersOnly && book.discountPercent <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return Number(String(b.id).replace(/\D/g, "")) - Number(String(a.id).replace(/\D/g, ""));
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating;
      }
    });
  }, [catalogBooks, wishlist, wishlistOnly, selectedCategory, searchQuery, selectedFormats, selectedLanguages, selectedAuthors, maxPrice, minPrice, inStockOnly, bestsellerOnly, newReleaseOnly, offersOnly, sortBy]);

  // Active filters count
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (wishlistOnly ? 1 : 0) +
    selectedFormats.length +
    selectedLanguages.length +
    selectedAuthors.length +
    (maxPrice < 1000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (bestsellerOnly ? 1 : 0) +
    (newReleaseOnly ? 1 : 0) +
    (offersOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-20">
      {/* 1. SHOP HEADER & BREADCRUMB */}
      <div className="bg-gradient-to-b from-red-50/70 via-white to-[#FBFBFC] border-b border-gray-100 py-3.5 sm:py-6 lg:py-8">
        <div className="max-w-[1450px] mx-auto px-3.5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-500 mb-1 sm:mb-2">
            <Link href="/" className="hover:text-[#C61821] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Shop</span>
            {selectedCategory !== "all" && (
              <>
                <span>/</span>
                <span className="text-[#C61821] font-bold capitalize truncate max-w-[160px]">
                  {SHOP_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </nav>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
                <span className="text-[#C61821]">Book Shop</span>
              </h1>
            </div>

            {/* Trust Badges */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-gray-600 bg-white px-4 py-2 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-gray-700">
                <Truck className="w-4 h-4 text-[#C61821]" />
                <span>Free Ship Above ₹499</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* QUICK CATEGORY CHIPS CAROUSEL */}
          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SHOP_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? "bg-[#C61821] text-white shadow-xs scale-[1.02]"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-red-200 hover:bg-red-50/50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (SIDEBAR + PRODUCT GRID) */}
      <div className="max-w-[1450px] mx-auto px-3.5 sm:px-6 lg:px-8 mt-3 sm:mt-6">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ======================================================== */}
          {/* DESKTOP FILTER SIDEBAR (col-span-3) */}
          {/* ======================================================== */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs sticky top-28 space-y-6">
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#C61821]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C61821] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#C61821] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Quick Filter Badges */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Special Collections
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wishlistOnly}
                    onChange={(e) => setWishlistOnly(e.target.checked)}
                    className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                  />
                  <Heart className="w-3.5 h-3.5 text-[#C61821] fill-current" />
                  <span>My Wishlist ({wishlist.length})</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bestsellerOnly}
                    onChange={(e) => setBestsellerOnly(e.target.checked)}
                    className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                  />
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bestsellers Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newReleaseOnly}
                    onChange={(e) => setNewReleaseOnly(e.target.checked)}
                    className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>New 2025 Editions</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={offersOnly}
                    onChange={(e) => setOffersOnly(e.target.checked)}
                    className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                  />
                  <Award className="w-3.5 h-3.5 text-red-500" />
                  <span>20%+ Discount Deals</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Max Price
                </span>
                <span className="text-[#C61821]">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={200}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C61821] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>₹200</span>
                <span>₹600</span>
                <span>₹1000</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Category
              </label>
              <div className="space-y-1.5">
                {SHOP_FORMATS.map((fmt) => {
                  const isChecked = selectedFormats.includes(fmt);
                  return (
                    <label
                      key={fmt}
                      className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedFormats((prev) =>
                              isChecked
                                ? prev.filter((f) => f !== fmt)
                                : [...prev, fmt]
                            );
                          }}
                          className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                        />
                        <span>{fmt}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {catalogBooks.filter((b) => b.format === fmt).length}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Language Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Medium / Language
              </label>
              <div className="space-y-1.5">
                {SHOP_LANGUAGES.map((lang) => {
                  const isChecked = selectedLanguages.includes(lang);
                  return (
                    <label
                      key={lang}
                      className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedLanguages((prev) =>
                              isChecked
                                ? prev.filter((l) => l !== lang)
                                : [...prev, lang]
                            );
                          }}
                          className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                        />
                        <span>{lang}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {catalogBooks.filter((b) => b.language === lang).length}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>


            {/* Author Filter */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Authors &amp; Faculty
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {SHOP_AUTHORS.map((author) => {
                  const isChecked = selectedAuthors.includes(author);
                  return (
                    <label
                      key={author}
                      className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedAuthors((prev) =>
                            isChecked
                              ? prev.filter((a) => a !== author)
                              : [...prev, author]
                          );
                        }}
                        className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                      />
                      <span className="truncate">{author}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* MAIN PRODUCT LIST / GRID (col-span-12 or col-span-9) */}
          {/* ======================================================== */}
          <main className="col-span-12 lg:col-span-9 space-y-4">
            
            {/* TOOLBAR CONTROLS */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-2 sm:p-3.5 shadow-xs flex items-center justify-between gap-1.5 sm:gap-3">
              
              {/* Left: Mobile Filter Button + Results Count */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#C61821] text-xs font-bold transition-all border border-red-200/80 active:scale-95 cursor-pointer shadow-2xs shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C61821]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#C61821] text-white text-[9px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <p className="text-[11px] sm:text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="hidden xs:inline">Showing </span>
                  <span className="font-bold text-gray-900">{filteredBooks.length}</span>
                  <span className="text-gray-400">/{catalogBooks.length}</span>
                  <span className="hidden sm:inline"> books</span>
                </p>
              </div>

              {/* Right: Search Input + Sort Dropdown + View Toggle */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                
                {/* Search in Shop (Desktop) */}
                <div className="relative hidden md:block w-44 lg:w-56">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in shop..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821] focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-800 text-[11px] sm:text-xs font-semibold py-1.5 pl-2 sm:pl-3 pr-6 sm:pr-8 rounded-lg focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="rating">Top Rated</option>
                    <option value="discount">Discount</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 sm:right-2 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-[#C61821] shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-white text-[#C61821] shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE FILTER TAGS PILLS */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-gray-400 font-medium mr-0.5">
                  Filters:
                </span>

                {wishlistOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-[#C61821] text-[11px] font-bold border border-rose-200">
                    <Heart className="w-3 h-3 fill-current" />
                    Wishlist ({wishlist.length})
                    <button onClick={() => setWishlistOnly(false)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-[#C61821] text-[11px] font-bold border border-red-100">
                    {SHOP_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {bestsellerOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                    Bestsellers
                    <button onClick={() => setBestsellerOnly(false)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {newReleaseOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                    New 2025
                    <button onClick={() => setNewReleaseOnly(false)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {offersOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    20%+ Off
                    <button onClick={() => setOffersOnly(false)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200">
                    In Stock
                    <button onClick={() => setInStockOnly(false)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice < 1000 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200">
                    ≤ ₹{maxPrice}
                    <button onClick={() => setMaxPrice(1000)} className="hover:opacity-75">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200"
                  >
                    {fmt}
                    <button
                      onClick={() =>
                        setSelectedFormats((p) => p.filter((f) => f !== fmt))
                      }
                      className="hover:opacity-75"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200"
                  >
                    {lang}
                    <button
                      onClick={() =>
                        setSelectedLanguages((p) => p.filter((l) => l !== lang))
                      }
                      className="hover:opacity-75"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedAuthors.map((author) => (
                  <span
                    key={author}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200"
                  >
                    {author}
                    <button
                      onClick={() =>
                        setSelectedAuthors((p) => p.filter((a) => a !== author))
                      }
                      className="hover:opacity-75"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-[#C61821] hover:underline ml-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* EMPTY STATE */}
            {filteredBooks.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4 my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#C61821] flex items-center justify-center mx-auto shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No books matched your criteria
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    Try clearing some filters or searching for terms like "MPPSC", "BNS", "Civil Judge", or "Hindi Grammar".
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold inline-flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-red-600/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* GRID VIEW */}
            {viewMode === "grid" && filteredBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredBooks.map((book) => {
                  const isWishlisted = isInWishlist(book.id);
                  const isCarted = isInCart(book.id);

                  return (
                    <div
                      key={book.id}
                      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-red-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
                    >
                      {/* Top Card Media Showcase */}
                      <div className="relative bg-gradient-to-b from-gray-50 to-white p-4 flex flex-col items-center justify-center border-b border-gray-100 overflow-hidden min-h-[220px]">
                        
                        {/* Badges Overlay */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          {book.badge ? (
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                book.badgeColor || "bg-[#C61821] text-white"
                              }`}
                            >
                              {book.badge}
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                              {book.format}
                            </span>
                          )}

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(book)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isWishlisted
                                ? "bg-red-50 text-[#C61821] scale-110 shadow-xs"
                                : "bg-white/80 hover:bg-white text-gray-400 hover:text-[#C61821] shadow-2xs"
                            }`}
                            aria-label="Wishlist"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isWishlisted ? "fill-[#C61821]" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Book Cover Image */}
                        <Link
                          href={`/product/${book.id}`}
                          className="w-28 sm:w-32 aspect-[1/1.4] relative flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-200"
                        >
                          <img
                            src={book.image}
                            alt={book.title}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
                          />
                        </Link>

                        {/* Quick View Button Hover */}
                        <button
                          onClick={() => openModalForBook(book)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-3 px-3 py-1.5 rounded-lg bg-gray-900/80 hover:bg-gray-900 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-xs shadow-md"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick Preview</span>
                        </button>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Exam Tag + Rating */}
                          <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="font-bold text-[#C61821] uppercase tracking-wide">
                              {book.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{book.rating}</span>
                              <span className="text-gray-400 font-normal">
                                ({book.reviewsCount})
                              </span>
                            </div>
                          </div>

                          {/* Book Title */}
                          <Link
                            href={`/product/${book.id}`}
                            className="font-bold text-sm text-gray-900 group-hover:text-[#C61821] transition-colors line-clamp-1 cursor-pointer leading-snug block"
                          >
                            {book.title}
                          </Link>

                          {/* Hindi Title / Subtitle */}
                          <p className="text-[11px] text-gray-500 font-devanagari line-clamp-1 mt-0.5">
                            {book.hindiTitle || book.subtitle}
                          </p>

                          {/* Author */}
                          <p className="text-[10.5px] text-gray-400 font-medium mt-1">
                            by {book.author}
                          </p>
                        </div>

                        {/* Price & Cart Action */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-extrabold text-gray-900">
                                ₹{book.price}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{book.originalPrice}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600">
                              {book.discountPercent}% OFF
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(book)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                              isCarted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-[#C61821] hover:bg-[#8F0E15] text-white shadow-xs"
                            }`}
                          >
                            {isCarted ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>In Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && filteredBooks.length > 0 && (
              <div className="space-y-4">
                {filteredBooks.map((book) => {
                  const isWishlisted = isInWishlist(book.id);
                  const isCarted = isInCart(book.id);

                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-2xl border border-gray-200/80 hover:border-red-200 hover:shadow-lg transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch relative"
                    >
                      {/* Left Book Image */}
                      <Link
                        href={`/product/${book.id}`}
                        className="w-24 sm:w-28 shrink-0 aspect-[1/1.4] mx-auto sm:mx-0 flex items-center justify-center cursor-pointer bg-gray-50 rounded-xl p-2"
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md"
                        />
                      </Link>

                      {/* Middle Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-[#C61821] uppercase">
                              {book.category}
                            </span>
                            <span className="text-[10.5px] font-medium text-gray-500">
                              {book.exam}
                            </span>
                            {book.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase ${
                                  book.badgeColor || "bg-gray-800 text-white"
                                }`}
                              >
                                {book.badge}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/product/${book.id}`}
                            className="text-base font-bold text-gray-900 hover:text-[#C61821] transition-colors cursor-pointer block"
                          >
                            {book.title}
                          </Link>
                          {book.hindiTitle && (
                            <p className="text-xs text-gray-600 font-devanagari mt-0.5">
                              {book.hindiTitle}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            by <span className="text-gray-700 font-medium">{book.author}</span> • {book.edition}
                          </p>

                          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                            {book.description}
                          </p>

                          {/* Highlights */}
                          {book.highlights && (
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              {book.highlights.slice(0, 3).map((hl, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md text-gray-600 flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{hl}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-2">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{book.rating}</span>
                          <span className="text-gray-400 font-normal">
                            ({book.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Right Price & Actions */}
                      <div className="sm:w-44 sm:border-l sm:border-gray-100 sm:pl-5 flex sm:flex-col justify-between sm:justify-center items-end sm:items-stretch gap-3 shrink-0">
                        <div>
                          <div className="flex items-baseline gap-1.5 sm:justify-end">
                            <span className="text-xl font-extrabold text-gray-900">
                              ₹{book.price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{book.originalPrice}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 sm:text-right block">
                            {book.discountPercent}% Instant Savings
                          </span>
                          <span className="text-[10.5px] text-gray-400 sm:text-right block mt-0.5">
                            Free Shipping Available
                          </span>
                        </div>

                        <div className="flex sm:flex-col gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(book)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isCarted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-[#C61821] hover:bg-[#8F0E15] text-white shadow-xs"
                            }`}
                          >
                            {isCarted ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>In Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openModalForBook(book)}
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE SLIDEOVER FILTER DRAWER */}
      {/* ======================================================== */}
      {isMobileFilterOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] lg:hidden flex justify-end overflow-hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Filter Books"
            data-lenis-prevent
            className="relative w-[88vw] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-gray-100"
            style={{ height: "100%", maxHeight: "100dvh" }}
          >
            {/* Drawer Header (shrink-0) */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C61821]" />
                <span className="font-extrabold text-sm text-gray-900">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C61821] text-white text-[10px] font-bold">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#C61821] hover:underline flex items-center gap-1 cursor-pointer py-1 px-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-3.5 space-y-5 divide-y divide-gray-100"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              
              {/* 1. Mobile Search in Shop */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Search in Shop
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, authors, exams..."
                    className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C61821] focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Categories */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Category / Exam
                  </label>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-[10px] font-bold text-[#C61821] hover:underline"
                    >
                      Show All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SHOP_CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                          isActive
                            ? "bg-[#C61821] text-white shadow-xs font-bold"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-200/80 text-gray-600"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Special Collections */}
              <div className="space-y-2 pt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Special Collections
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 select-none">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={wishlistOnly}
                        onChange={(e) => setWishlistOnly(e.target.checked)}
                        className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                      />
                      <Heart className="w-3.5 h-3.5 text-[#C61821] fill-current" />
                      <span>My Wishlist</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">
                      ({wishlist.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 select-none">
                    <input
                      type="checkbox"
                      checked={bestsellerOnly}
                      onChange={(e) => setBestsellerOnly(e.target.checked)}
                      className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                    />
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bestsellers Only</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 select-none">
                    <input
                      type="checkbox"
                      checked={newReleaseOnly}
                      onChange={(e) => setNewReleaseOnly(e.target.checked)}
                      className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>New 2025 Editions</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 select-none">
                    <input
                      type="checkbox"
                      checked={offersOnly}
                      onChange={(e) => setOffersOnly(e.target.checked)}
                      className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                    />
                    <Award className="w-3.5 h-3.5 text-red-500" />
                    <span>20%+ Discount Deals</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* 4. Price Slider */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Max Price
                  </span>
                  <span className="text-sm font-extrabold text-[#C61821] bg-red-50 px-2 py-0.5 rounded-md">
                    ₹{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C61821] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>₹200</span>
                  <span>₹600</span>
                  <span>₹1000</span>
                </div>
              </div>

              {/* 5. Category */}
              <div className="space-y-2 pt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Category
                </label>
                <div className="space-y-1.5">
                  {SHOP_FORMATS.map((fmt) => {
                    const isChecked = selectedFormats.includes(fmt);
                    return (
                      <label
                        key={fmt}
                        className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-50 select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedFormats((prev) =>
                                isChecked
                                  ? prev.filter((f) => f !== fmt)
                                  : [...prev, fmt]
                              );
                            }}
                            className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                          />
                          <span>{fmt}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {catalogBooks.filter((b) => b.format === fmt).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 6. Language */}
              <div className="space-y-2 pt-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Medium / Language
                </label>
                <div className="space-y-1.5">
                  {SHOP_LANGUAGES.map((lang) => {
                    const isChecked = selectedLanguages.includes(lang);
                    return (
                      <label
                        key={lang}
                        className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-50 select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedLanguages((prev) =>
                                isChecked
                                  ? prev.filter((l) => l !== lang)
                                  : [...prev, lang]
                              );
                            }}
                            className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                          />
                          <span>{lang}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {catalogBooks.filter((b) => b.language === lang).length}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>


              {/* 8. Authors & Faculty */}
              <div className="space-y-2 pt-4 pb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Authors &amp; Faculty
                </label>
                <div className="space-y-1.5">
                  {SHOP_AUTHORS.map((author) => {
                    const isChecked = selectedAuthors.includes(author);
                    return (
                      <label
                        key={author}
                        className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-50 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedAuthors((prev) =>
                              isChecked
                                ? prev.filter((a) => a !== author)
                                : [...prev, author]
                            );
                          }}
                          className="w-4 h-4 text-[#C61821] rounded border-gray-300 focus:ring-[#C61821]"
                        />
                        <span className="truncate">{author}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Sticky Bottom Footer (shrink-0) */}
            <div className="p-3.5 border-t border-gray-200 bg-white shadow-lg flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors active:scale-95 cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[2] py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-95 text-center cursor-pointer"
              >
                Show {filteredBooks.length} Books
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* QUICK VIEW PREVIEW MODAL */}
      <BookModal
        book={selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C61821]"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
