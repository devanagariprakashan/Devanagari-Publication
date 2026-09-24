"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Percent,
  ArrowRight,
  Check,
  Copy,
  X,
  Phone,
  CheckCircle2,
  Grid,
} from "lucide-react";
import { useFeaturedCoupon } from "@/components/providers/FeaturedCouponProvider";
import { couponHeadline } from "@/lib/coupon-shared";
import { DEFAULT_NAV_COLOR, DEFAULT_NAV_ICON, NAV_COLORS, NAV_GROUPS, NAV_ICONS } from "@/data/categoryNav";

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  hindi_name?: string | null;
  nav_group?: string | null;
  nav_icon?: string | null;
  nav_badge?: string | null;
  nav_color?: string | null;
}

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: NavCategory[];
  bookCount: number;
  phone: string;
  whatsappUrl: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  onSelectSubCategory?: (href: string) => void;
}

export default function CategoryMegaMenu({
  isOpen,
  onClose,
  categories,
  bookCount,
  phone,
  whatsappUrl,
  freeShippingEnabled,
  freeShippingThreshold,
  onSelectSubCategory,
}: CategoryMegaMenuProps) {
  const [copied, setCopied] = useState(false);
  const coupon = useFeaturedCoupon();
  const offerTitle = coupon ? couponHeadline(coupon) : "";
  const offerCode = coupon?.code ?? "";

  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    if (onSelectSubCategory) {
      onSelectSubCategory(href);
    }
    onClose();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* SOLID WHITE FULL-WIDTH MEGA MENU CONTAINER */}
      <div
        className="megamenu-content absolute top-full left-0 w-full bg-white border-b border-gray-200/90 shadow-2xl shadow-black/10 z-[100] transition-all duration-200 animate-in fade-in slide-in-from-top-1"
        onMouseLeave={onClose}
      >
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* TOP SLIM HEADER STRIP */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C61821] flex items-center justify-center text-white shadow-xs">
                <Grid className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                  Shop by Categories &amp; Exams
                </h3>
                {bookCount > 0 && (
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#C61821] border border-red-100 uppercase tracking-wider">
                    {bookCount}+ Publications
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[#C61821] text-xs font-bold transition-all active:scale-95"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4-COLUMN GRID: EXAMS | ACADEMIC | LEISURE (live from Admin → Categories) | FEATURED (live from Admin → Coupons) */}
          <div className="grid grid-cols-12 gap-5 lg:gap-6 items-start">
            {NAV_GROUPS.map((group) => {
              const items = categories.filter((category) => category.nav_group === group.id);
              return (
                <div key={group.id} className={coupon ? "col-span-3" : "col-span-4"}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#C61821]">
                      {group.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-devanagari font-normal hidden xl:inline">
                      ({group.hindiLabel})
                    </span>
                    <div className="h-px flex-1 bg-red-100" />
                  </div>

                  <div className="space-y-1">
                    {items.length === 0 && <p className="text-xs text-gray-400">None yet</p>}
                    {items.map((category) => {
                      const href = `/shop?category=${category.slug}`;
                      const Icon = NAV_ICONS[category.nav_icon ?? DEFAULT_NAV_ICON] ?? NAV_ICONS[DEFAULT_NAV_ICON];
                      const colors = NAV_COLORS[category.nav_color ?? DEFAULT_NAV_COLOR] ?? NAV_COLORS[DEFAULT_NAV_COLOR];
                      return (
                        <Link
                          key={category.id}
                          href={href}
                          onClick={() => handleLinkClick(href)}
                          className="group flex items-center justify-between p-2 rounded-xl hover:bg-red-50/70 border border-transparent hover:border-red-100/60 transition-all duration-150"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1">
                            <div className={`w-7 h-7 rounded-lg ${colors.iconBg} ${colors.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="text-[13px] font-semibold text-gray-800 group-hover:text-[#C61821] transition-colors leading-tight">
                                {category.name}
                              </span>
                              {category.hindi_name && (
                                <span className="text-[10.5px] text-gray-400 font-devanagari font-normal leading-normal pt-0.5 block truncate">
                                  {category.hindi_name}
                                </span>
                              )}
                            </div>
                          </div>

                          {category.nav_badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${colors.badgeColor}`}>
                              {category.nav_badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* FEATURED PROMO CARD - only shown while a coupon is marked "Featured" in Admin → Coupons */}
            {coupon && (
              <div className="col-span-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/95 via-red-50/60 to-orange-50/40 border border-red-100/90 p-4 flex flex-col justify-between h-full min-h-[200px] shadow-2xs">
                  {/* Background watermark badge */}
                  <div className="absolute -right-3 -bottom-3 opacity-10 text-[#C61821] pointer-events-none">
                    <Percent className="w-24 h-24 stroke-[1.5]" />
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C61821] mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C61821] animate-pulse" />
                      FEATURED
                    </div>

                    <h4 className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight font-serif">
                      {offerTitle}
                    </h4>

                    <div className="text-[11px] text-gray-500 mt-1.5 leading-relaxed flex items-center gap-1.5 flex-wrap">
                      <span>Use code</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(offerCode, e)}
                        className="inline-flex items-center gap-1 font-bold text-gray-800 bg-white/90 px-2 py-0.5 rounded-md border border-red-200 hover:border-[#C61821] hover:bg-white shadow-2xs transition-all cursor-pointer"
                        title="Click to copy coupon code"
                      >
                        <span>{offerCode}</span>
                        {copied ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-700" />
                        )}
                      </button>
                      <span>at checkout.</span>
                    </div>

                    {copied && (
                      <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block animate-in fade-in">
                        ✓ Coupon code copied to clipboard!
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 mt-4 pt-2">
                    <Link
                      href="/shop"
                      onClick={() => handleLinkClick("/shop")}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-full shadow-xs hover:shadow-sm transition-all group cursor-pointer active:scale-95"
                    >
                      <span>Shop now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SLIM FOOTER STRIP */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {freeShippingEnabled && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free Shipping on Orders Above ₹{freeShippingThreshold}
                </span>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#084C38] font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helpline: {phone}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
