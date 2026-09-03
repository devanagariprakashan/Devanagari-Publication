"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Heart, Info, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

export default function GlobalToast() {
  const { toast, hideToast, setIsCartDrawerOpen, setIsWishlistDrawerOpen } =
    useCartWishlist();

  if (!toast) return null;

  const isCart = toast.type === "cart";
  const isWishlist = toast.type === "wishlist";

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[120] max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#111827] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-gray-700/80 flex items-start gap-3 backdrop-blur-md">
        {/* Left Icon / Image */}
        {toast.image ? (
          <div className="w-12 h-14 rounded-lg bg-gray-800 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-gray-700">
            <img
              src={toast.image}
              alt={toast.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${
              isCart
                ? "bg-emerald-500/20 text-emerald-400"
                : isWishlist
                ? "bg-rose-500/20 text-rose-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {isCart ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isWishlist ? (
              <Heart className="w-5 h-5 fill-current" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                isCart
                  ? "text-emerald-400"
                  : isWishlist
                  ? "text-rose-400"
                  : "text-blue-400"
              }`}
            >
              {toast.title}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] font-medium text-gray-200 line-clamp-1 mt-0.5">
            {toast.message}
          </p>

          {/* Quick Action Button */}
          {isCart && (
            <Link
              href="/cart"
              onClick={() => hideToast()}
              className="mt-2 text-[11px] font-bold text-[#FF8086] hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {isWishlist && (
            <Link
              href="/wishlist"
              onClick={() => hideToast()}
              className="mt-2 text-[11px] font-bold text-rose-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>View Wishlist</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={hideToast}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
