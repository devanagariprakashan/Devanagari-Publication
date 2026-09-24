"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blogContent";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  TrendingUp,
} from "lucide-react";

export default function BlogContent({ settings, items }: { settings: Record<string, string>; items: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = ["All", ...Array.from(new Set(items.map(post => post.category)))];

  const filteredPosts = items.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16 ">
      {/* HEADER BREADCRUMB */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{settings.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{settings.subtitle}</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Blog</span>
          </nav>
        </div>
      </section>

      {/* SEARCH AND CATEGORY COMPACT BAR */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C61821] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={settings.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* POSTS COMPACT GRID */}
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">{settings.emptyTitle}</h3>
            <p className="text-sm text-gray-500 mt-1">{settings.emptyDescription}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                {/* Compact Image Banner */}
                <div
                  className={`h-28 bg-gradient-to-br ${post.imageBg} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}
                >
                  {post.image && <><Image src={post.image} alt={post.title} fill unoptimized sizes="400px" className="object-cover" /><div className="absolute inset-0 bg-black/20" /></>}
                  <div className="relative flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-white/90">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C61821] transition-colors leading-snug line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 text-[#C61821] flex items-center justify-center font-bold text-[10px]">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-800 leading-tight">
                          {post.author}
                        </h4>
                      </div>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-bold text-[#C61821] group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* COMPACT NEWSLETTER CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>{settings.ctaBadge}</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">
              {settings.ctaTitle}
            </h3>
            <p className="text-white/70 text-xs">
              {settings.ctaDescription}
            </p>
          </div>
          <Link
            href={settings.ctaHref}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C61821] text-white font-bold text-xs shadow-md hover:bg-red-700 transition-all hover:scale-105"
          >
            {settings.ctaLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
