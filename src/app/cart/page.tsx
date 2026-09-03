"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Tag,
  ChevronRight,
  Heart,
  ArrowLeft,
  Lock,
  RotateCcw,
  Check,
  X,
  BookOpen,
  CreditCard,
  Zap,
} from "lucide-react";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";
import { ALL_BOOKS } from "@/data/booksData";
import BookModal from "@/components/home/BookModal";
import { BookData } from "@/components/home/HeroBook3D";

interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
  minAmount?: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "DEVA10",
    label: "10% OFF",
    type: "percent",
    value: 10,
    description: "Flat 10% Extra Discount on all exam books",
  },
  {
    code: "STUDENT50",
    label: "₹50 OFF",
    type: "fixed",
    value: 50,
    minAmount: 399,
    description: "₹50 Instant Discount on orders above ₹399",
  },
];

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartSavings,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCartWishlist();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [selectedBookForModal, setSelectedBookForModal] = useState<BookData | null>(null);

  // Delivery calculation
  const isFreeDelivery = cartTotal >= freeDeliveryThreshold || cart.length === 0;
  const neededForFree = Math.max(0, freeDeliveryThreshold - cartTotal);
  const freeProgress = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));
  const deliveryCharge = isFreeDelivery ? 0 : 49;

  // Coupon discount calculation
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minAmount && cartTotal < appliedCoupon.minAmount) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round((cartTotal * appliedCoupon.value) / 100);
    }
    return Math.min(cartTotal, appliedCoupon.value);
  }, [appliedCoupon, cartTotal]);

  const finalPayable = Math.max(0, cartTotal - couponDiscount + deliveryCharge);
  const totalCombinedSavings = cartSavings + couponDiscount;

  // Handle Apply Coupon
  const handleApplyCoupon = (couponToApply?: Coupon) => {
    setCouponError(null);
    setCouponSuccess(null);

    const code = (couponToApply ? couponToApply.code : couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      setCouponError("Invalid coupon code. Try DEVA10 or STUDENT50");
      return;
    }

    if (found.minAmount && cartTotal < found.minAmount) {
      setCouponError(`Minimum order value ₹${found.minAmount} required for ${found.code}`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput("");
    setCouponSuccess(`Code '${found.code}' applied successfully!`);
    setTimeout(() => setCouponSuccess(null), 3500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  // Move item to wishlist
  const handleMoveToWishlist = (item: (typeof cart)[0]) => {
    toggleWishlist({
      id: item.id,
      title: item.title,
      hindiTitle: item.hindiTitle,
      category: item.category,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      edition: item.edition,
    });
    removeFromCart(item.id);
  };

  // Recommended books (not already in cart)
  const recommendedBooks = useMemo(() => {
    const cartIds = new Set(cart.map((c) => c.id));
    return ALL_BOOKS.filter((b) => !cartIds.has(b.id)).slice(0, 4);
  }, [cart]);

  // Convert book to BookData for modal preview
  const openModalForItem = (item: (typeof ALL_BOOKS)[0]) => {
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

  return (
    <main className="min-h-screen bg-[#FBFBFC] text-[#1D2129] pb-20 md:pb-14">
      {/* 1. Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C61821] font-semibold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="bg-gradient-to-b from-red-50/50 via-white to-[#FBFBFC] border-b border-gray-200/70 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-[#C61821] flex items-center justify-center shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <span>Shopping Cart</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#C61821]">
                      {cartCount} {cartCount === 1 ? "Book" : "Books"}
                    </span>
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Review your exam books, apply discounts & proceed to safe checkout
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#C61821] hover:border-red-200 bg-white transition-all shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xs space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-red-50 text-[#C61821] flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Your cart is empty. Explore top MPPSC, Judiciary & exam books.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all active:scale-95"
              >
                <span>Browse All Exam Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/wishlist"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:text-[#C61821] hover:border-red-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white transition-all shadow-2xs"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>View Wishlist</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart: Responsive 2-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: Items & Delivery Meter (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Meter Banner */}
              <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      🎉 Congrats! You’ve unlocked FREE Delivery across India!
                    </span>
                  ) : (
                    <span className="text-gray-700">
                      Add <span className="font-bold text-[#C61821]">₹{neededForFree}</span> more books to get <span className="font-bold text-emerald-600">FREE Express Delivery</span>
                    </span>
                  )}
                  <span className="text-gray-500 font-bold tabular-nums text-[11px]">
                    ₹{cartTotal} / ₹{freeDeliveryThreshold}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isFreeDelivery ? "bg-emerald-500" : "bg-[#C61821]"
                    }`}
                    style={{ width: `${freeProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List Container */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Books in your cart ({cartCount})
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    Standard Paperback Edition
                  </span>
                </div>

                {/* Compact Modern Product Rows */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => {
                    const discount = item.originalPrice
                      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                      : 0;
                    const wishlisted = isInWishlist(item.id);

                    return (
                      <div
                        key={item.id}
                        className="p-3 sm:p-3.5 hover:bg-red-50/15 transition-colors flex gap-3 sm:gap-4 items-center group"
                      >
                        {/* Book Thumbnail (Compact & Crisp) */}
                        <div className="w-13 h-18 sm:w-16 sm:h-[84px] shrink-0 bg-gray-50/80 rounded-lg p-0.5 flex items-center justify-center border border-gray-150 overflow-hidden shadow-2xs group-hover:border-red-150 transition-colors">
                          <img
                            src={item.image || "/images/books/image-2.png"}
                            alt={item.title}
                            className="h-full w-full object-contain filter drop-shadow-2xs"
                          />
                        </div>

                        {/* Details & Controls */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          {/* Row 1: Badges, Title & Delete */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                {item.category && (
                                  <span className="text-[9px] font-bold text-[#C61821] uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                                    {item.category}
                                  </span>
                                )}
                                {item.edition && (
                                  <span className="text-[10px] text-gray-400 font-medium truncate">
                                    {item.edition}
                                  </span>
                                )}
                                <span className="hidden sm:inline-flex text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/60">
                                  In Stock
                                </span>
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-1 group-hover:text-[#C61821] transition-colors">
                                {item.title}
                              </h4>
                              {item.hindiTitle && (
                                <p className="text-[11px] text-gray-500 font-devanagari line-clamp-1 leading-tight mt-0.5">
                                  {item.hindiTitle}
                                </p>
                              )}
                            </div>

                            {/* Actions on Desktop: Wishlist + Delete */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveToWishlist(item)}
                                title={wishlisted ? "Already in Wishlist" : "Save for Later"}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  wishlisted
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                }`}
                                aria-label="Save to Wishlist"
                              >
                                <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Quantity Stepper & Price Row */}
                          <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-gray-50">
                            {/* Stepper */}
                            <div className="flex items-center border border-gray-200/90 rounded-md bg-gray-50/80 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-5.5 h-5.5 rounded flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-2xs active:scale-95 transition-all cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="min-w-[24px] sm:min-w-[28px] text-center font-bold text-xs text-gray-800 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-5.5 h-5.5 rounded flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-2xs active:scale-95 transition-all cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price Breakdown */}
                            <div className="flex items-baseline gap-2 justify-end">
                              {discount > 0 && (
                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/60 leading-none">
                                  {discount}% OFF
                                </span>
                              )}
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-xs text-gray-400 line-through tabular-nums">
                                  ₹{item.originalPrice * item.quantity}
                                </span>
                              )}
                              <span className="text-sm sm:text-base font-black text-gray-900 tabular-nums">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-gray-200/80 p-3 text-center flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold text-gray-900">100% Genuine</span>
                  <span className="text-[10px] text-gray-400">Direct from Publication</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200/80 p-3 text-center flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-900">Fast Shipping</span>
                  <span className="text-[10px] text-gray-400">All India Delivery</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200/80 p-3 text-center flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold text-gray-900">Secure Payment</span>
                  <span className="text-[10px] text-gray-400">256-Bit SSL Encryption</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200/80 p-3 text-center flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-[#C61821]" />
                  <span className="text-xs font-bold text-gray-900">Latest 2025-26</span>
                  <span className="text-[10px] text-gray-400">Updated Exam Pattern</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Checkout (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              {/* Coupon / Promo Widget */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Tag className="w-4 h-4 text-[#C61821]" />
                    <span>Apply Promo Code</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Promo Input */}
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleApplyCoupon();
                        }}
                        placeholder="e.g. DEVA10"
                        className="flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821]/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Pre-set Coupon Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {AVAILABLE_COUPONS.map((cp) => (
                        <button
                          key={cp.code}
                          type="button"
                          onClick={() => handleApplyCoupon(cp)}
                          className="text-[10px] font-bold px-2 py-1 rounded-md border border-dashed border-red-300 bg-red-50/60 text-[#C61821] hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>{cp.code}</span>
                          <span className="text-gray-500 font-normal">({cp.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-emerald-900">{appliedCoupon.code} Applied</span>
                        <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-700 tabular-nums">
                      -₹{couponDiscount}
                    </span>
                  </div>
                )}

                {/* Feedback Messages */}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>
                )}
              </div>

              {/* Order Price Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total MRP ({cartCount} {cartCount === 1 ? "book" : "books"})</span>
                    <span className="font-semibold text-gray-900 tabular-nums">₹{cartOriginalTotal}</span>
                  </div>

                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Book Discount Savings</span>
                      <span className="font-bold tabular-nums">-₹{cartSavings}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span className="font-bold tabular-nums">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900 tabular-nums">₹{deliveryCharge}</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-gray-900">
                        Total Amount
                      </span>
                      <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
                    </div>
                    <span className="text-lg sm:text-xl font-black text-[#C61821] tabular-nums">
                      ₹{finalPayable}
                    </span>
                  </div>
                </div>

                {/* Savings Banner */}
                {totalCombinedSavings > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-center">
                    <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                      <span>🎉 You are saving ₹{totalCombinedSavings} on this order!</span>
                    </span>
                  </div>
                )}

                {/* Checkout CTA */}
                <div className="space-y-2 pt-1">
                  <Link
                    href="/checkout"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full py-2 text-center text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors block"
                  >
                    Add more books to cart
                  </Link>
                </div>

                {/* Payment Methods Info */}
                <div className="pt-2 border-t border-gray-100 text-center space-y-1.5">
                  <p className="text-[10.5px] text-gray-400 font-medium">
                    Guaranteed Safe & Secure Payment
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-[11px] font-semibold">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[9.5px]">UPI</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[9.5px]">Cards</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[9.5px]">NetBanking</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 text-[9.5px]">COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* 5. Clear Cart Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#C61821] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">Clear Shopping Cart?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove all {cartCount} items from your shopping cart?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setIsClearModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Quick Preview Modal */}
      {selectedBookForModal && (
        <BookModal
          book={selectedBookForModal}
          onClose={() => setSelectedBookForModal(null)}
          onAddToCart={(b) => {
            addToCart({
              id: b.id,
              title: b.title,
              subtitle: b.subtitle,
              category: b.category,
              price: b.price,
              originalPrice: b.originalPrice,
              image: b.image,
              edition: b.edition,
            });
            setSelectedBookForModal(null);
          }}
        />
      )}

      {/* 7. Mobile Sticky Bottom Checkout Bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <span className="text-[10px] text-gray-500 font-medium">Total Payable:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-[#C61821] tabular-nums">
                  ₹{finalPayable}
                </span>
                {totalCombinedSavings > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600">
                    Save ₹{totalCombinedSavings}
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/checkout"
              className="px-5 py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs shadow-md shadow-red-600/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Checkout ({cartCount})</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
