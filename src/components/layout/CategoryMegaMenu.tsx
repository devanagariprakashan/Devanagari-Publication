"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  GraduationCap,
  Scale,
  Landmark,
  Award,
  BookOpen,
  FileText,
  Flame,
  Globe,
  Feather,
  PenTool,
  Sparkles,
  Layers,
  Percent,
  ArrowRight,
  Check,
  Copy,
  X,
  Phone,
  CheckCircle2,
  Grid,
} from "lucide-react";

export interface CategoryItem {
  title: string;
  hindiTitle?: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  hindiName?: string;
  items: CategoryItem[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "exams",
    name: "EXAMS",
    hindiName: "प्रतियोगी परीक्षाएँ",
    items: [
      {
        title: "UPSC",
        hindiTitle: "संघ लोक सेवा आयोग",
        href: "/shop?category=upsc",
        badge: "Hindi Medium",
        badgeColor: "bg-amber-500 text-white",
        icon: Trophy,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        title: "MPPSC",
        hindiTitle: "मध्य प्रदेश लोक सेवा आयोग",
        href: "/shop?category=mppsc",
        badge: "Popular",
        badgeColor: "bg-[#C61821] text-white",
        icon: GraduationCap,
        iconBg: "bg-red-50",
        iconColor: "text-[#C61821]",
      },
      {
        title: "Judiciary",
        hindiTitle: "न्यायिक सेवा (CJ/ADPO)",
        href: "/shop?category=judiciary",
        badge: "Hot",
        badgeColor: "bg-rose-600 text-white",
        icon: Scale,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        title: "Civil Judge",
        hindiTitle: "सिविल जज प्रारंभिक व मुख्य",
        href: "/shop?category=judiciary&exam=civil-judge",
        icon: Landmark,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        title: "Competitive Exams",
        hindiTitle: "पुलिस एसआई व पटवारी",
        href: "/shop?category=state-si",
        badge: "5000+ MCQs",
        badgeColor: "bg-emerald-600 text-white",
        icon: Award,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
    ],
  },
  {
    id: "academic",
    name: "ACADEMIC",
    hindiName: "विधि एवं शैक्षणिक",
    items: [
      {
        title: "Hindi Grammar",
        hindiTitle: "सामान्य हिन्दी एवं व्याकरण",
        href: "/shop?category=hindi-literature",
        badge: "Bestseller",
        badgeColor: "bg-[#C61821] text-white",
        icon: BookOpen,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
      },
      {
        title: "Law Books",
        hindiTitle: "नवीन आपराधिक कानून (BNS/BNSS)",
        href: "/shop?category=new-criminal-laws",
        badge: "New 2025",
        badgeColor: "bg-purple-600 text-white",
        icon: Scale,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        title: "Current Affairs",
        hindiTitle: "समसामयिकी व वार्षिक अंक",
        href: "/shop?filter=new",
        icon: Flame,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        title: "General Knowledge",
        hindiTitle: "मध्य प्रदेश सामान्य ज्ञान (MP GK)",
        href: "/shop?category=mppsc&subject=mp-gk",
        icon: Globe,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        title: "Bare Acts & Diglot",
        hindiTitle: "डिग्लॉट बेयर एक्ट्स व कमेंट्री",
        href: "/shop?category=new-criminal-laws&format=diglot",
        icon: FileText,
        iconBg: "bg-sky-50",
        iconColor: "text-sky-600",
      },
    ],
  },
  {
    id: "leisure",
    name: "LEISURE",
    hindiName: "साहित्य एवं अन्य",
    items: [
      {
        title: "Literature",
        hindiTitle: "हिंदी साहित्य का इतिहास",
        href: "/shop?category=hindi-literature",
        icon: Feather,
        iconBg: "bg-pink-50",
        iconColor: "text-pink-600",
      },
      {
        title: "Essay & Drafting",
        hindiTitle: "निबंध संहिता व प्रारूप लेखन",
        href: "/shop?category=mppsc&exam=mains-hindi",
        badge: "Topper Pick",
        badgeColor: "bg-amber-600 text-white",
        icon: PenTool,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        title: "Children's Books",
        hindiTitle: "बाल साहित्य व प्रेरक कहानियां",
        href: "/shop?category=all",
        icon: Sparkles,
        iconBg: "bg-yellow-50",
        iconColor: "text-yellow-600",
      },
      {
        title: "Combos & Sets",
        hindiTitle: "संपूर्ण कॉम्बो पैक (विशेष छूट)",
        href: "/shop?filter=combos",
        badge: "Combos",
        badgeColor: "bg-[#C61821] text-white",
        icon: Layers,
        iconBg: "bg-red-50",
        iconColor: "text-[#C61821]",
      },
    ],
  },
];

// Backwards compatibility helper for existing references if needed
export const MEGA_CATEGORIES = [
  {
    id: "mppsc",
    name: "MPPSC & State Civil Services",
    hindiName: "मध्य प्रदेश लोक सेवा आयोग",
    count: "120+ Books",
    badge: "Trending",
    badgeColor: "bg-amber-500 text-white",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "Complete study material for MPPSC Prelims and Mains.",
    subcategories: [
      { title: "MPPSC Prelims Paper 1 (GS)", count: "24 Books", href: "/shop?category=mppsc&exam=prelims", isHot: true },
      { title: "Prelims Paper 2 (CSAT)", count: "12 Books", href: "/shop?category=mppsc&exam=csat" },
      { title: "Mains GS 1 to 6 Papers", count: "45 Books", href: "/shop?category=mppsc", isHot: true },
      { title: "MP Special GK & Tribal Heritage", count: "20 Books", href: "/shop?category=mppsc&subject=mp-gk", isHot: true },
    ],
  },
  {
    id: "new-criminal-laws",
    name: "New Criminal Laws 2024",
    hindiName: "नवीन आपराधिक कानून (BNS / BNSS / BSA)",
    count: "64+ Books",
    badge: "New 2025",
    badgeColor: "bg-[#C61821] text-white",
    icon: Scale,
    iconColor: "text-[#C61821]",
    bgColor: "bg-red-50",
    description: "Diglot editions & commentaries on the 3 new criminal codes.",
    subcategories: [
      { title: "भारतीय न्याय संहिता (BNS 2023/24)", count: "14 Books", href: "/shop?category=new-criminal-laws&subject=BNS", isHot: true },
      { title: "भारतीय नागरिक सुरक्षा संहिता (BNSS)", count: "12 Books", href: "/shop?category=new-criminal-laws&subject=BNSS" },
      { title: "भारतीय साक्ष्य अधिनियम (BSA 2023)", count: "10 Books", href: "/shop?category=new-criminal-laws&subject=BSA" },
      { title: "Old vs New Laws Comparison Charts", count: "8 Books", href: "/shop?category=new-criminal-laws&format=charts", isHot: true },
    ],
  },
  {
    id: "judiciary",
    name: "Judiciary & Civil Judge",
    hindiName: "न्यायिक सेवा परीक्षा (CJ / ADPO)",
    count: "85+ Books",
    badge: "Bestseller",
    badgeColor: "bg-blue-600 text-white",
    icon: Landmark,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Crafted for Judicial Services aspirants & advocates.",
    subcategories: [
      { title: "MP Civil Judge Entry Level", count: "22 Books", href: "/shop?category=judiciary&exam=civil-judge", isHot: true },
      { title: "ADPO Complete Course", count: "16 Books", href: "/shop?category=judiciary&exam=adpo" },
      { title: "Judgment Writing & Issue Framing", count: "12 Books", href: "/shop?category=judiciary&subject=judgment", isHot: true },
    ],
  },
  {
    id: "upsc",
    name: "UPSC Civil Services (Hindi)",
    hindiName: "संघ लोक सेवा आयोग",
    count: "95+ Books",
    badge: "Hindi Medium",
    badgeColor: "bg-emerald-600 text-white",
    icon: Trophy,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Authentic study material tailored for Hindi Medium aspirants.",
    subcategories: [
      { title: "General Studies Paper 1 to 4", count: "48 Books", href: "/shop?category=upsc", isHot: true },
      { title: "UPSC Prelims 25-Year PYQs", count: "10 Books", href: "/shop?category=upsc" },
      { title: "Hindi Literature Optional", count: "17 Books", href: "/shop?category=upsc" },
    ],
  },
];

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubCategory?: (href: string) => void;
}

export default function CategoryMegaMenu({
  isOpen,
  onClose,
  onSelectSubCategory,
}: CategoryMegaMenuProps) {
  const [copied, setCopied] = useState(false);

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
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#C61821] border border-red-100 uppercase tracking-wider">
                  500+ Publications
                </span>
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

          {/* 4-COLUMN MODERN GRID (EXAMS | ACADEMIC | LEISURE | FEATURED) */}
          <div className="grid grid-cols-12 gap-5 lg:gap-6 items-start">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.id} className="col-span-3">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#C61821]">
                    {group.name}
                  </span>
                  {group.hindiName && (
                    <span className="text-[10px] text-gray-400 font-devanagari font-normal hidden xl:inline">
                      ({group.hindiName})
                    </span>
                  )}
                  <div className="h-px flex-1 bg-red-100" />
                </div>

                {/* Column Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="group flex items-center justify-between p-2 rounded-xl hover:bg-red-50/70 border border-transparent hover:border-red-100/60 transition-all duration-150"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <div
                            className={`w-7 h-7 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[13px] font-semibold text-gray-800 group-hover:text-[#C61821] transition-colors leading-tight">
                              {item.title}
                            </span>
                            {item.hindiTitle && (
                              <span className="text-[10.5px] text-gray-400 font-devanagari font-normal leading-none mt-0.5 truncate">
                                {item.hindiTitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* 4TH COLUMN: FEATURED PROMO CARD */}
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
                    Save 25% on UPSC 2025 Editions
                  </h4>
                  
                  <div className="text-[11px] text-gray-500 mt-1.5 leading-relaxed flex items-center gap-1.5 flex-wrap">
                    <span>Use code</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode("UPSC25", e)}
                      className="inline-flex items-center gap-1 font-bold text-gray-800 bg-white/90 px-2 py-0.5 rounded-md border border-red-200 hover:border-[#C61821] hover:bg-white shadow-2xs transition-all cursor-pointer"
                      title="Click to copy coupon code"
                    >
                      <span>UPSC25</span>
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
                    href="/shop?category=upsc&filter=offers"
                    onClick={() => handleLinkClick("/shop?category=upsc&filter=offers")}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-full shadow-xs hover:shadow-sm transition-all group cursor-pointer active:scale-95"
                  >
                    <span>Shop now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SLIM FOOTER STRIP */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Free Shipping on Orders Above ₹499
              </span>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="text-[#084C38] font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helpline: +91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
