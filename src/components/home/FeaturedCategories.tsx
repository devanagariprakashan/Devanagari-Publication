"use client";

import React, { useState } from "react";
import {
  FileText,
  Landmark,
  Globe,
  GraduationCap,
  Trophy,
  Feather,
  LayoutGrid,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export interface CategoryItem {
  id: string;
  title: string;
  count: number;
  icon: React.ElementType;
  isNew?: boolean;
  filterKey?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "current-affairs",
    title: "Current Affairs",
    count: 1,
    icon: FileText,
    filterKey: "gs",
  },
  {
    id: "civil-judge",
    title: "Civil Judge",
    count: 0,
    icon: Landmark,
    filterKey: "judiciary",
  },
  {
    id: "gk",
    title: "General Knowledge",
    count: 0,
    icon: Globe,
    filterKey: "gs",
  },
  {
    id: "mppsc",
    title: "MPPSC",
    count: 3,
    icon: GraduationCap,
    filterKey: "mppsc",
  },
  {
    id: "upsc",
    title: "UPSC",
    count: 1,
    icon: Trophy,
    filterKey: "mppsc",
  },
  {
    id: "literature",
    title: "Literature",
    count: 0,
    icon: Feather,
    filterKey: "hindi",
  },
  {
    id: "other",
    title: "Other",
    count: 12,
    icon: LayoutGrid,
    isNew: true,
    filterKey: "all",
  },
];

interface FeaturedCategoriesProps {
  onSelectCategory?: (categoryId: string) => void;
}

export default function FeaturedCategories({
  onSelectCategory,
}: FeaturedCategoriesProps) {
  const [selectedId, setSelectedId] = useState<string>("current-affairs");



  const handleBrowseAll = () => {
    const booksSection = document.getElementById("bestsellers");
    if (booksSection) {
      booksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="categories"
      className="relative py-10 sm:py-2 lg:py-14 bg-[#FCFCFD] overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* TOP HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>

            {/* Main Title */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 tracking-tight leading-tight flex items-center flex-wrap">
              <span>Explore Books by </span>
              <span className="text-[#C61821] inline-flex items-center ml-1.5">
                Category
                {/* Decorative Pink/Coral Squiggle Wave */}
                <svg
                  className="ml-2 w-7 sm:w-9 h-3 sm:h-3.5 text-[#F87171]"
                  viewBox="0 0 45 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M2 7C5.5 3 9 11 12.5 7C16 3 19.5 11 23 7C26.5 3 30 11 33.5 7C37 3 40.5 11 43 7" />
                </svg>
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-[15px] text-gray-500 mt-3 font-normal">
              Find the right books to crack your exam with confidence.
            </p>
          </div>

          {/* Right Action: Browse All Books & Book Icon */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleBrowseAll}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#C61821] transition-colors cursor-pointer"
            >
              <span>Browse all books</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#C61821] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={handleBrowseAll}
              aria-label="Browse all books"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-50/80 hover:bg-red-100/80 border border-red-100/90 flex items-center justify-center text-[#C61821] transition-all hover:scale-105 shadow-2xs cursor-pointer shrink-0"
            >
              <BookOpen className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* CATEGORIES GRID / HORIZONTAL ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 lg:gap-3.5 mt-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.filterKey || "all"}`}
                onClick={() => {
                  setSelectedId(cat.id);
                  if (onSelectCategory) {
                    onSelectCategory(cat.id);
                  }
                }}
                className={`group relative flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-[5px] bg-white transition-all duration-200 cursor-pointer select-none min-h-[58px] sm:min-h-[64px] border border-[#c61821] ${
                  isSelected
                    ? "border-[2px] border-[#C61821] shadow-sm ring-2 ring-[#C61821]/5"
                    : "border border-gray-100/90 hover:border-[#C61821]/30 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {/* NEW Corner Badge on Top Right */}
                {cat.isNew && (
                  <span className="absolute -top-2 -right-1 bg-[#C61821] text-white text-[8.5px] sm:text-[9px] font-extrabold p-5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs z-10">
                    NEW
                  </span>
                )}

                {/* Left: Icon in Soft Pink/Red Tinted Container */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isSelected
                      ? "bg-red-100/80 text-[#C61821]"
                      : "bg-red-50/80 text-[#C61821] group-hover:bg-red-100/60"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8]" />
                </div>

                {/* Middle: Title */}
                <div className="flex-1 min-w-0 px-1">
                  <span
                    className={`text-[12px] sm:text-[13px] font-bold block leading-tight line-clamp-2 transition-colors ${
                      isSelected
                        ? "text-gray-900"
                        : "text-gray-800 group-hover:text-[#C61821]"
                    }`}
                  >
                    {cat.title}
                  </span>
                </div>

                {/* Right: Count Badge */}
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "bg-red-100 text-[#C61821]"
                        : "bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#C61821]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Active Red Pill Indicator */}
                {isSelected && (
                  <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-8 sm:w-10 h-[3px] bg-[#C61821] rounded-full shadow-xs" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

