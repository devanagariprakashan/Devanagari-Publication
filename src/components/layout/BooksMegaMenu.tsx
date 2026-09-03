"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Flame,
  Sparkles,
  Award,
  Languages,
  BookA,
  Layers,
  Tag,
  IndianRupee,
  ShoppingBag,
  Crown,
  ArrowRight,
  Percent,
} from "lucide-react";

interface BooksMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (href: string) => void;
}

export interface MenuItem {
  title: string;
  hindiTitle?: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export const POPULAR_LINKS: MenuItem[] = [
  {
    title: "All Books",
    hindiTitle: "सभी पुस्तकें",
    href: "/shop",
    icon: BookOpen,
    iconBg: "bg-red-50",
    iconColor: "text-[#C61821]",
  },
  {
    title: "Bestsellers",
    hindiTitle: "सर्वाधिक बिकने वाली",
    href: "/shop?filter=bestsellers",
    badge: "New",
    badgeColor: "bg-amber-500 text-white",
    icon: Flame,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "New Releases",
    hindiTitle: "नवीनतम संस्करण 2025",
    href: "/shop?filter=new",
    badge: "New",
    badgeColor: "bg-emerald-600 text-white",
    icon: Sparkles,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Featured Editions",
    hindiTitle: "विशेष पुस्तकें",
    href: "/shop?filter=featured",
    icon: Award,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export const LANGUAGE_LINKS: MenuItem[] = [
  {
    title: "Hindi Books",
    hindiTitle: "हिंदी माध्यम",
    href: "/shop?language=Hindi",
    icon: Languages,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    title: "English Books",
    hindiTitle: "English Medium",
    href: "/shop?language=English",
    icon: BookA,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    title: "Bilingual (द्विभाषी)",
    hindiTitle: "Hindi + English",
    href: "/shop?language=Bilingual",
    badge: "Popular",
    badgeColor: "bg-purple-600 text-white",
    icon: Layers,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export const PRICE_LINKS: MenuItem[] = [
  {
    title: "Under ₹300",
    hindiTitle: "किफायती पुस्तकें",
    href: "/shop?maxPrice=300",
    icon: Tag,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    title: "₹300 – ₹500",
    hindiTitle: "मानक पुस्तकें",
    href: "/shop?minPrice=300&maxPrice=500",
    icon: IndianRupee,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "₹500 – ₹1000",
    hindiTitle: "गाइड्स और सेट्स",
    href: "/shop?minPrice=500&maxPrice=1000",
    icon: ShoppingBag,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Above ₹1000",
    hindiTitle: "संपूर्ण कॉम्बो पैक",
    href: "/shop?minPrice=1000",
    badge: "Combos",
    badgeColor: "bg-[#C61821] text-white",
    icon: Crown,
    iconBg: "bg-red-50",
    iconColor: "text-[#C61821]",
  },
];

export default function BooksMegaMenu({
  isOpen,
  onClose,
  onSelect,
}: BooksMegaMenuProps) {
  if (!isOpen) return null;

  const handleLinkClick = (href: string) => {
    if (onSelect) {
      onSelect(href);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="book-megamenu-content absolute top-full left-0 w-full bg-white border-b border-gray-200/80 shadow-xl shadow-black/8 z-[100] transition-all duration-200 animate-in fade-in slide-in-from-top-1"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-12 gap-5 items-start">
          {/* ======================================================== */}
          {/* COL 1: POPULAR */}
          {/* ======================================================== */}
          <div className="col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C61821]">
                POPULAR
              </span>
              <div className="h-px flex-1 bg-red-100" />
            </div>

            <div className="space-y-1">
              {POPULAR_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-red-50/70 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[13px] font-medium text-gray-800 group-hover:text-[#C61821] transition-colors leading-tight">
                          {item.title}
                        </span>
                        {item.hindiTitle && (
                          <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                            {item.hindiTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 2: LANGUAGE */}
          {/* ======================================================== */}
          <div className="col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C61821]">
                LANGUAGE
              </span>
              <div className="h-px flex-1 bg-red-100" />
            </div>

            <div className="space-y-1">
              {LANGUAGE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-red-50/70 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[13px] font-medium text-gray-800 group-hover:text-[#C61821] transition-colors leading-tight">
                          {item.title}
                        </span>
                        {item.hindiTitle && (
                          <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                            {item.hindiTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 3: BY PRICE */}
          {/* ======================================================== */}
          <div className="col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C61821]">
                BY PRICE
              </span>
              <div className="h-px flex-1 bg-red-100" />
            </div>

            <div className="space-y-1">
              {PRICE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-red-50/70 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-md ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[13px] font-medium text-gray-800 group-hover:text-[#C61821] transition-colors leading-tight">
                          {item.title}
                        </span>
                        {item.hindiTitle && (
                          <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                            {item.hindiTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 4: FEATURED PROMO CARD */}
          {/* ======================================================== */}
          <div className="col-span-3">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50/90 via-red-50/50 to-orange-50/40 border border-red-100/80 p-4 flex flex-col justify-between h-full min-h-[170px] shadow-2xs">
              {/* Background watermark badge */}
              <div className="absolute -right-3 -bottom-3 opacity-10 text-[#C61821] pointer-events-none">
                <Percent className="w-24 h-24 stroke-[1.5]" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C61821] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C61821] animate-pulse" />
                  FEATURED OFFER
                </div>

                <h4 className="text-[15px] font-bold text-gray-900 leading-snug tracking-tight font-serif">
                  Save 25% on 2025 Exam Editions
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Use code <span
  onClick={() => navigator.clipboard.writeText("UPSC25")}
  className="font-bold text-gray-800 bg-white/80 px-1 py-0.5 rounded border border-red-100 cursor-pointer hover:bg-gray-50"
  title="Click to copy"
>
  UPSC25
</span> at checkout.
                </p>
              </div>

              <div className="relative z-10 mt-3 pt-2">
                <Link
                  href="/shop?filter=offers"
                  onClick={() => handleLinkClick("/shop?filter=offers")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-full shadow-xs hover:shadow-sm transition-all group cursor-pointer"
                >
                  <span>Shop now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
