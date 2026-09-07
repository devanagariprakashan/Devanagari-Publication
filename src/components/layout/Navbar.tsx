"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  Heart,
  ShoppingCart,
  Bell,
  Phone,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Users,
  FileText,
  Mail,
  Grid,
  ChevronRight,
  LayoutDashboard,
  Package,
  MapPin,
  LogOut,
} from "lucide-react";
import CategoryMegaMenu, {
  CATEGORY_GROUPS,
  MEGA_CATEGORIES,
} from "@/components/layout/CategoryMegaMenu";
import BooksMegaMenu, {
  POPULAR_LINKS,
  LANGUAGE_LINKS,
  PRICE_LINKS,
} from "@/components/layout/BooksMegaMenu";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  onSearch?: (query: string) => void;
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({
  onSearch,
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cartCount: globalCartCount,
    wishlistCount: globalWishlistCount,
    setIsCartDrawerOpen,
    setIsWishlistDrawerOpen,
  } = useCartWishlist();

  const cartCount = propCartCount !== undefined ? propCartCount : globalCartCount;
  const wishlistCount =
    propWishlistCount !== undefined ? propWishlistCount : globalWishlistCount;

  const [searchQuery, setSearchQuery] = useState("");
  const [isBooksMenuOpen, setIsBooksMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileBooksOpen, setIsMobileBooksOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileCategoriesAccordionOpen, setIsMobileCategoriesAccordionOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // Account Dropdown
  // ponytail: no read-state persistence, bell just shows latest 2; add read tracking when needed
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<{ id: string; text: string }[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [userProfile, setUserProfile] = useState({
    name: "User",
    email: "",
  });

  useEffect(() => {
    const syncUser = () => {
      if (typeof window === "undefined") return;
      const isLoggedOut = localStorage.getItem("devanagari_logged_out");
      if (isLoggedOut === "true") {
        setIsLoggedIn(false);
        setUserProfile({
          name: "User",
          email: "",
        });
        return;
      }
      const storedUser = localStorage.getItem("devanagari_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserProfile({
            name: parsed.name || parsed.fullName || "User",
            email: parsed.email || "",
          });
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Failed to parse user session in Navbar", e);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile({
          name: "User",
          email: "",
        });
      }
    };

    setTimeout(() => {
      syncUser();
    }, 0);
    window.addEventListener("storage", syncUser);
    window.addEventListener("devanagari_user_updated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("devanagari_user_updated", syncUser);
    };
  }, []);

  // Lock body scroll when mobile menu or categories modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isMobileCategoriesOpen) {
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.start();
        }
      };
    }
  }, [isMobileMenuOpen, isMobileCategoriesOpen]);

  const categoriesBtnRef = useRef<HTMLButtonElement>(null);
  const booksBtnRef = useRef<HTMLDivElement>(null);
  const accountBtnRef = useRef<HTMLDivElement>(null);
  const bellBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createClient()
      .from("announcements")
      .select("id,text")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(2)
      .then(({ data }) => {
        if (data) setAnnouncements(data);
      });
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("devanagari_user");
      localStorage.setItem("devanagari_logged_out", "true");
      window.dispatchEvent(new Event("devanagari_user_updated"));
    }
    setIsLoggedIn(false);
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  // Close dropdowns on route changes
  const prevPathnameRef = useRef(pathname);
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    setIsBooksMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsMobileCategoriesOpen(false);
    setIsMobileCategoriesAccordionOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsAccountMenuOpen(false);
    setIsBellOpen(false);
  }

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesBtnRef.current &&
        !categoriesBtnRef.current.contains(event.target as Node)
      ) {
        const megaMenu = document.querySelector(".megamenu-content");
        if (!megaMenu || !megaMenu.contains(event.target as Node)) {
          setIsMegaMenuOpen(false);
        }
      }

      if (
        booksBtnRef.current &&
        !booksBtnRef.current.contains(event.target as Node)
      ) {
        const bookMegaMenu = document.querySelector(".book-megamenu-content");
        if (!bookMegaMenu || !bookMegaMenu.contains(event.target as Node)) {
          setIsBooksMenuOpen(false);
        }
      }

      if (
        accountBtnRef.current &&
        !accountBtnRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }

      if (
        bellBtnRef.current &&
        !bellBtnRef.current.contains(event.target as Node)
      ) {
        setIsBellOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsBooksMenuOpen(false);
        setIsMegaMenuOpen(false);
        setIsMobileCategoriesOpen(false);
        setIsMobileCategoriesAccordionOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setIsAccountMenuOpen(false);
        setIsBellOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsMobileSearchOpen(false);

    if (pathname === "/shop") {
      if (onSearch) {
        onSearch(searchQuery);
      }
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubCategorySelect = (href: string) => {
    setIsBooksMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsMobileCategoriesOpen(false);
    setIsMobileMenuOpen(false);
    router.push(href);
  };


  return (
    <>
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6">
          {/* ======================================================== */}
          {/* LEFT: BRAND LOGO */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group">
              <img 
                src="/logos.png" 
                alt="Devanagari Books" 
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* ======================================================== */}
          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 2xl:gap-6 text-[14px] xl:text-[15px] font-semibold text-gray-700 shrink-0">
            {/* 1. Books Dropdown / Mega Menu Trigger */}
            <div
              ref={booksBtnRef}
              className="relative"
              onMouseEnter={() => {
                setIsBooksMenuOpen(true);
                setIsMegaMenuOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsBooksMenuOpen(!isBooksMenuOpen);
                  setIsMegaMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 hover:text-[#C61821] transition-colors py-1 px-1 cursor-pointer font-semibold select-none ${
                  isBooksMenuOpen || pathname === "/shop"
                    ? "text-[#C61821] font-bold"
                    : "text-gray-700"
                }`}
                aria-expanded={isBooksMenuOpen}
              >
                <span>Books</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isBooksMenuOpen ? "rotate-180 text-[#C61821]" : ""
                  }`}
                />
              </button>
            </div>

            {/* 2. Categories Dropdown / Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => {
                setIsMegaMenuOpen(true);
                setIsBooksMenuOpen(false);
              }}
            >
              <button
                type="button"
                ref={categoriesBtnRef}
                onClick={() => {
                  setIsMegaMenuOpen(!isMegaMenuOpen);
                  setIsBooksMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 hover:text-[#C61821] transition-colors py-1 px-1 cursor-pointer font-semibold select-none ${
                  isMegaMenuOpen
                    ? "text-[#C61821] font-bold"
                    : "text-gray-700"
                }`}
                aria-expanded={isMegaMenuOpen}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180 text-[#C61821]" : ""
                  }`}
                />
              </button>
            </div>

            {/* 3. Authors */}
            <Link
              href="/#authors"
              className="hover:text-[#C61821] transition-colors whitespace-nowrap py-1 px-1 text-gray-700 font-semibold"
            >
              Authors
            </Link>

            {/* 4. Blog */}
            <Link
              href="/blog"
              className={`hover:text-[#C61821] transition-colors whitespace-nowrap py-1 px-1 ${
                pathname === "/blog"
                  ? "text-[#C61821] font-bold"
                  : "text-gray-700 font-semibold"
              }`}
            >
              Blog
            </Link>

            {/* 5. Team */}
            <Link
              href="/team"
              className={`hover:text-[#C61821] transition-colors whitespace-nowrap py-1 px-1 ${
                pathname === "/team"
                  ? "text-[#C61821] font-bold"
                  : "text-gray-700 font-semibold"
              }`}
            >
              Team
            </Link>

            {/* 6. Contact */}
            <Link
              href="/contact"
              className={`hover:text-[#C61821] transition-colors whitespace-nowrap py-1 px-1 ${
                pathname === "/contact"
                  ? "text-[#C61821] font-bold"
                  : "text-gray-700 font-semibold"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* ======================================================== */}
          {/* SEARCH BAR (AFTER MENU ON DESKTOP) */}
          {/* ======================================================== */}
          <div className="hidden md:flex items-center flex-1 max-w-[200px] lg:max-w-[240px] xl:max-w-[320px] 2xl:max-w-[380px] min-w-0 mx-1 lg:mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div
                className={`relative flex items-center bg-[#F9FAFB] rounded-full border transition-all duration-200 ${
                  isSearchFocused
                    ? "border-[#C61821] bg-white ring-2 ring-red-100 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search books, exams..."
                  className="w-full bg-transparent pl-3.5 pr-10 py-1.5 xl:py-2 text-xs xl:text-sm text-gray-800 placeholder-gray-400 rounded-full focus:outline-none truncate"
                />

                {/* Clear search text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-gray-400 hover:text-gray-600 mr-8 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 w-7 h-7 xl:w-7.5 xl:h-7.5 rounded-full bg-[#A81119] hover:bg-[#8F0E15] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: ACTION ICONS */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-3 text-gray-700 shrink-0">
            {/* Announcements bell */}
            <div ref={bellBtnRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsBellOpen((prev) => !prev)}
                aria-label="Announcements"
                aria-expanded={isBellOpen}
                className="flex p-2 rounded-[5px] transition-colors cursor-pointer text-gray-700 hover:text-[#C61821] hover:bg-red-50"
                title="Announcements"
              >
                <Bell className="w-6 h-6" strokeWidth={1.8} />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C61821]" />
                )}
              </button>
              {isBellOpen && (
                <div className="absolute top-full right-0 pt-2 w-72 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-2 space-y-1">
                      {announcements.length === 0 && (
                        <p className="px-3 py-2.5 text-sm text-gray-500">
                          No announcements.
                        </p>
                      )}
                      {announcements.map((a) => (
                        <p
                          key={a.id}
                          className="px-3 py-2.5 text-sm text-gray-700"
                        >
                          {a.text}
                        </p>
                      ))}
                      <Link
                        href="/announcements"
                        onClick={() => setIsBellOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#C61821] bg-red-50 rounded-xl transition-colors hover:bg-red-100/70"
                      >
                        Show all
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Separator between Menu & Actions */}
            <div className="hidden lg:block h-6 w-px bg-gray-200 mr-1" />
            {/* Profile - Desktop only */}
            <div
              ref={accountBtnRef}
              className="relative hidden md:block"
              onMouseEnter={() => {
                if (isLoggedIn) setIsAccountMenuOpen(true);
              }}
              onMouseLeave={() => {
                setIsAccountMenuOpen(false);
              }}
            >
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                  aria-label="User Account"
                  aria-expanded={isAccountMenuOpen}
                  className="flex p-2 rounded-[5px] transition-colors cursor-pointer text-[#C61821] bg-red-50"
                  title="My Account"
                >
                  <User
                    className="w-6 h-6"
                    strokeWidth={2.2}
                  />
                </button>
              ) : (
                <Link
                  href="/login"
                  aria-label="User Account"
                  className="flex p-2 rounded-[5px] transition-colors cursor-pointer text-gray-700 hover:text-[#C61821] hover:bg-red-50"
                  title="Login"
                >
                  <User className="w-6 h-6" strokeWidth={1.8} />
                </Link>
              )}

              {/* Account Dropdown */}
              {isLoggedIn && isAccountMenuOpen && (
                <div className="absolute top-full right-0 pt-2 w-64 z-50 transition-all duration-150">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-red-50/40 to-white">
                      <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-[#C61821] shrink-0 shadow-xs border border-red-100/50">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">
                            {userProfile.name}
                          </h4>
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 border border-emerald-100">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                    {/* Links */}
                    <div className="p-2 space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#C61821] bg-red-50 rounded-xl transition-colors hover:bg-red-100/70"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </div>
                    {/* Logout */}
                    <div className="p-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#C61821] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

              {/* Wishlist - Desktop only (in mobile bottom bar) */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={`hidden md:flex relative p-2 rounded-[5px] transition-colors cursor-pointer ${
                  pathname === "/wishlist"
                    ? "text-[#C61821] bg-red-50"
                    : "text-gray-700 hover:text-[#C61821] hover:bg-red-50"
                }`}
              >
                <Heart
                  className="w-6 h-6"
                  strokeWidth={pathname === "/wishlist" ? 2.2 : 1.8}
                />
                {wishlistCount > 0 && (
                  <span
                    key={`nav-wishlist-${wishlistCount}`}
                    className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#C61821] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 duration-200"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart - Desktop only (in mobile bottom bar) */}
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className={`hidden md:flex relative p-2 rounded-[5px] transition-colors cursor-pointer ${
                  pathname === "/cart"
                    ? "text-[#C61821] bg-red-50"
                    : "text-gray-700 hover:text-[#C61821] hover:bg-red-50"
                }`}
              >
                <ShoppingCart
                  className="w-6 h-6"
                  strokeWidth={pathname === "/cart" ? 2.2 : 1.8}
                />
                {cartCount > 0 && (
                  <span
                    key={`nav-cart-${cartCount}`}
                    className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#C61821] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-xs animate-in zoom-in-50 duration-200"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Search Button (Visible only on mobile/tablet) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                aria-label="Toggle search"
                className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                  isMobileSearchOpen
                    ? "bg-red-50 text-[#C61821]"
                    : "text-gray-700 hover:text-[#C61821] hover:bg-gray-100"
                }`}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Mobile Menu Toggle Button (Hamburger) */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if (isMobileSearchOpen) setIsMobileSearchOpen(false);
                }}
                aria-label="Toggle menu"
                className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                  isMobileMenuOpen
                    ? "bg-red-50 text-[#C61821]"
                    : "text-gray-700 hover:text-[#C61821] hover:bg-gray-100"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

        {/* ======================================================== */}
        {/* MOBILE INTERACTIVE SEARCH OVERLAY / DROPDOWN */}
        {/* ======================================================== */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center bg-[#F9FAFB] rounded-full border border-gray-200 focus-within:border-[#C61821] focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, MPPSC, Law, Judiciary..."
                  className="w-full bg-transparent pl-4 pr-16 py-2.5 text-xs text-gray-800 placeholder-gray-400 rounded-full focus:outline-none"
                />

                {/* Clear search text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-gray-400 hover:text-gray-600 mr-1 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 w-7 h-7 rounded-full bg-[#A81119] hover:bg-[#8F0E15] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 px-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 shrink-0">
                Popular:
              </span>
              {[
                { label: "MPPSC", query: "MPPSC" },
                { label: "Civil Judge", query: "सिविल जज" },
                { label: "Hindi Vyakaran", query: "हिंदी व्याकरण" },
                { label: "BNS Law", query: "BNS" },
                { label: "History", query: "इतिहास" },
              ].map((chip) => (
                <button
                  key={chip.query}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip.query);
                    setIsMobileSearchOpen(false);
                    router.push(`/shop?search=${encodeURIComponent(chip.query)}`);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-[#C61821] border border-gray-200/60 shrink-0 whitespace-nowrap transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* FULL WIDTH DESKTOP BOOKS MEGA MENU */}
      {/* ======================================================== */}
      <div className="hidden md:block">
        <BooksMegaMenu
          isOpen={isBooksMenuOpen}
          onClose={() => setIsBooksMenuOpen(false)}
          onSelect={handleSubCategorySelect}
        />
      </div>

      {/* ======================================================== */}
      {/* FULL WIDTH DESKTOP CATEGORY MEGA MENU */}
      {/* ======================================================== */}
      <div className="hidden md:block">
        <CategoryMegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          onSelectSubCategory={handleSubCategorySelect}
        />
      </div>
    </header>

      {/* ======================================================== */}
      {/* MOBILE CATEGORIES BOTTOM SHEET (COMPACT & FULLY VISIBLE) */}
      {/* ======================================================== */}
      {isMobileCategoriesOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileCategoriesOpen(false)}
        >
          <div
            className="fixed inset-x-0 bottom-0 h-[80vh] max-h-[82vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

            {/* Sheet Header - Compact */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50/40 to-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C61821] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Grid className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    Book Categories <span className="text-xs font-normal text-gray-500 font-devanagari">(श्रेणियाँ)</span>
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Select an exam or category to explore
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCategoriesOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Shop Link Button - Compact banner */}
            <div className="px-3 py-1.5 bg-red-50/50 border-b border-red-100/60 shrink-0">
              <Link
                href="/shop"
                onClick={() => setIsMobileCategoriesOpen(false)}
                className="w-full py-1.5 px-3 rounded-lg bg-[#C61821] text-white text-xs font-bold flex items-center justify-between shadow-2xs active:scale-[0.99] transition-transform"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Visit All Books Shop Page</span>
                </span>
                <span className="text-xs">→</span>
              </Link>
            </div>

            {/* Scrollable Category Groups - Compact 2-Column Grid */}
            <div
              data-lenis-prevent
              className="p-3 overflow-y-auto space-y-3 flex-1 min-h-0 overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[10.5px] font-bold tracking-wider uppercase text-[#C61821]">
                      {group.name}
                    </span>
                    {group.hindiName && (
                      <span className="text-[9.5px] text-gray-400 font-devanagari">
                        ({group.hindiName})
                      </span>
                    )}
                    <div className="h-px flex-1 bg-red-100/80" />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setIsMobileCategoriesOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/90 hover:bg-red-50/80 border border-gray-200/60 hover:border-red-200 active:scale-[0.98] transition-all shadow-2xs min-w-0"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1 justify-center">
                            <span className="text-[11.5px] font-bold text-gray-900 leading-snug truncate">
                              {item.title}
                            </span>
                            {item.hindiTitle && (
                              <span className="text-[10px] text-gray-500 font-devanagari leading-normal block pt-0.5 truncate">
                                {item.hindiTitle}
                              </span>
                            )}
                            {item.badge && (
                              <span
                                className={`text-[7.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider self-start mt-1 truncate max-w-full ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Support Button - Compact */}
            <div className="p-2.5 border-t border-gray-100 bg-white shrink-0">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-[#084C38] hover:bg-[#063b2c] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Need Guidance? Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE HAMBURGER MENU DRAWER (SMOOTH SCROLL & Z-[100]) */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-black/60 backdrop-blur-xs z-[100] animate-in fade-in duration-150"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain p-5 pb-36 space-y-6"
              style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
            >
              {/* Main Navigation Links: Books, Categories, Authors, Blog, Team, Contact */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Navigation Menu
                </h3>
                <div className="flex flex-col space-y-2 font-medium text-gray-800">
                  {/* 1. Books with Submenu Accordion */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between p-3 bg-white">
                      <Link
                        href="/shop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 font-bold text-gray-900 hover:text-[#C61821] flex-1"
                      >
                        <BookOpen className="w-5 h-5 text-[#C61821]" />
                        <span>Books (किताबें)</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsMobileBooksOpen(!isMobileBooksOpen)}
                        className="p-1 text-gray-400 hover:text-[#C61821] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Expand Books Submenu"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isMobileBooksOpen ? "rotate-180 text-[#C61821]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {isMobileBooksOpen && (
                      <div className="bg-gray-50/80 p-3 pt-1 border-t border-gray-100 space-y-3 animate-in fade-in duration-150">
                        {/* Popular */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C61821] px-1">
                            Popular
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                            {POPULAR_LINKS.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-red-200 text-xs font-medium text-gray-800"
                                >
                                  <div className={`w-6 h-6 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate">{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C61821] px-1">
                            Language
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                            {LANGUAGE_LINKS.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 hover:border-red-200 text-[11px] font-medium text-gray-800"
                                >
                                  <div className={`w-6 h-6 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-1`}>
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate w-full">{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C61821] px-1">
                            By Price
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                            {PRICE_LINKS.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-red-200 text-xs font-medium text-gray-800"
                                >
                                  <div className={`w-6 h-6 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate">{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Categories with Submenu Accordion (Compact in menu) */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between p-3 bg-white">
                      <button
                        type="button"
                        onClick={() => setIsMobileCategoriesAccordionOpen(!isMobileCategoriesAccordionOpen)}
                        className="flex items-center justify-between w-full font-bold text-gray-900 hover:text-[#C61821] text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Grid className="w-5 h-5 text-amber-600" />
                          <span>Categories (श्रेणियाँ)</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isMobileCategoriesAccordionOpen ? "rotate-180 text-[#C61821]" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    {isMobileCategoriesAccordionOpen && (
                      <div className="bg-gray-50/80 p-2.5 pt-1 border-t border-gray-100 space-y-2.5 animate-in fade-in duration-150">
                        {CATEGORY_GROUPS.map((group) => (
                          <div key={`drawer-cat-${group.id}`} className="space-y-1.5">
                            <div className="flex items-center gap-1.5 px-1 pt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C61821]">
                                {group.name} {group.hindiName && `(${group.hindiName})`}
                              </span>
                              <div className="h-px flex-1 bg-red-100" />
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={`drawer-item-${item.title}`}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:border-red-200 text-xs font-medium text-gray-800 transition-colors min-h-[46px]"
                                  >
                                    <div className={`w-6 h-6 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                                      <span className="text-[11px] font-bold text-gray-900 truncate leading-snug">
                                        {item.title}
                                      </span>
                                      {item.hindiTitle && (
                                        <span className="text-[10px] text-gray-500 font-devanagari truncate leading-normal block pt-0.5">
                                          {item.hindiTitle}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Authors */}
                  <Link
                    href="/#authors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center gap-3 font-semibold text-gray-800 border border-gray-50"
                  >
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Authors (लेखक)</span>
                  </Link>

                  {/* 4. Blog */}
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center gap-3 font-semibold text-gray-800 border border-gray-50"
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Blog (ब्लॉग)</span>
                  </Link>

                  {/* 5. Team */}
                  <Link
                    href="/team"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center gap-3 font-semibold text-gray-800 border border-gray-50"
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Team (टीम)</span>
                  </Link>

                  {/* 6. Contact */}
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center gap-3 font-semibold text-gray-800 border border-gray-50"
                  >
                    <Mail className="w-5 h-5 text-rose-600" />
                    <span>Contact (संपर्क)</span>
                  </Link>

                  {/* 7. Cart */}
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center justify-between font-semibold text-gray-800 border border-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-[#C61821]" />
                      <span>Shopping Cart (मेरी कार्ट)</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#C61821] text-white rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* 8. Wishlist */}
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-xl hover:bg-red-50 hover:text-[#C61821] flex items-center justify-between font-semibold text-gray-800 border border-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-[#C61821]" />
                      <span>Wishlist (मेरी विशलिस्ट)</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#C61821] text-white rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* 8. My Account / Login */}
                  {isLoggedIn ? (
                    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                      <div className="flex items-center justify-between p-3 bg-red-50 border-b border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#C61821] shadow-sm shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">{userProfile.name}</span>
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Verified</span>
                            </div>
                            <span className="text-xs text-gray-500">{userProfile.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 space-y-1 bg-white">
                        <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#C61821] bg-red-50 rounded-lg">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <div className="my-1 border-t border-gray-100"></div>
                        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#C61821] hover:bg-red-50 rounded-lg cursor-pointer">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-red-50 text-[#C61821] hover:bg-red-100 flex items-center justify-between font-bold border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-[#C61821]" />
                        <span>Login / Register (लॉगिन करें)</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Footer Info */}
              <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free Shipping on orders above ₹499</span>
                </div>
                <p className="font-semibold text-[#C61821]">
                  देवनागरी पब्लिकेशन प्रा. लि.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
