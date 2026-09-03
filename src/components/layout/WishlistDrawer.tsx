"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistCount,
    moveToCart,
    removeFromWishlist,
    clearWishlist,
    isWishlistDrawerOpen,
    setIsWishlistDrawerOpen,
    isInCart,
  } = useCartWishlist();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWishlistDrawerOpen) {
        setIsWishlistDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistDrawerOpen, setIsWishlistDrawerOpen]);

  // Lock scroll
  useEffect(() => {
    if (isWishlistDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistDrawerOpen]);

  if (!isWishlistDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsWishlistDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Wishlist Drawer"
        aria-modal="true"
        className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-gray-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-rose-50/40 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#C61821] flex items-center justify-center shadow-2xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">
                Your Saved Books
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {wishlistCount} {wishlistCount === 1 ? "book" : "books"} in your wishlist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-rose-50 cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-[#C61821] shadow-inner">
                <Heart className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Wishlist is Empty
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto mt-1">
                  Save your favourite MPPSC, Judiciary & exam books here to read or buy later.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="px-6 py-3 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Explore Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            wishlist.map((item) => {
              const discount = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;
              const alreadyInCart = isInCart(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs hover:border-red-200 transition-all flex gap-3.5 items-start"
                >
                  {/* Book Image */}
                  <div className="w-16 sm:w-20 aspect-[1/1.35] shrink-0 bg-gray-50 rounded-xl p-1 flex items-center justify-center border border-gray-100 overflow-hidden">
                    <img
                      src={item.image || "/images/books/image-2.png"}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {item.category && (
                            <span className="text-[9.5px] font-extrabold text-[#C61821] uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          )}
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-1 mt-1">
                            {item.title}
                          </h4>
                          {item.hindiTitle && (
                            <p className="text-[11px] text-gray-500 font-devanagari line-clamp-1">
                              {item.hindiTitle}
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.rating && (
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold mt-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.rating}</span>
                          {item.reviewsCount && (
                            <span className="text-gray-400 font-normal">
                              ({item.reviewsCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price & Move to Cart Button */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-50">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-gray-900">
                            ₹{item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-[10.5px] text-gray-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="text-[9.5px] font-bold text-emerald-600">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => moveToCart(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          alreadyInCart
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[#C61821] hover:bg-[#8F0E15] text-white shadow-xs"
                        }`}
                      >
                        {alreadyInCart ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-2">
            <Link
              href="/wishlist"
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-red-600/20"
            >
              <span>View Full Wishlist Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
