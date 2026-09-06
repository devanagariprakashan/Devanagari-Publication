"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  TrendingUp,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: "MPPSC" | "Judiciary" | "Hindi Sahitya" | "Exam Strategy";
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  imageBg: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "mppsc-prelims-2025-strategy",
    title: "MPPSC 2025: New Syllabus & 90-Day Prelims Strategy",
    excerpt:
      "Best study material and important chapters for General Studies and MP Special as per the latest MPPSC exam pattern.",
    category: "MPPSC",
    author: "Mr. Mayank Sharma",
    authorRole: "Senior Faculty & Author",
    readTime: "6 min read",
    date: "Feb 28, 2025",
    imageBg: "from-red-600 to-amber-700",
  },
  {
    id: "bns-criminal-laws-guide",
    title: "New Criminal Laws 2024: What changed for Judiciary & Civil Judge?",
    excerpt:
      "Key sections of new laws replacing IPC, CrPC, and Evidence Act, and mains answer writing approach.",
    category: "Judiciary",
    author: "Adv. Sunita Joshi",
    authorRole: "Judicial Services Mentor",
    readTime: "8 min read",
    date: "Feb 25, 2025",
    imageBg: "from-blue-700 to-indigo-900",
  },
  {
    id: "hindi-vyakaran-mppsc-paper-5",
    title: "MPPSC Mains Paper-5: How to score 150+ in General Hindi & Grammar",
    excerpt:
      "Practical techniques to get full marks in Sandhi, Samas, Idioms, Technical Vocabulary, and Pallavan.",
    category: "Hindi Sahitya",
    author: "Dr. Rajesh Verma",
    authorRole: "Hindi Sahitya Expert",
    readTime: "5 min read",
    date: "Feb 20, 2025",
    imageBg: "from-emerald-700 to-teal-900",
  },
  {
    id: "civil-judge-answer-writing",
    title: "MP Civil Judge Mains 2025: Judgment Writing & Case Law Reference Guide",
    excerpt:
      "Formatting, framing issues, and using relevant Supreme Court precedents in civil and criminal judgment writing.",
    category: "Judiciary",
    author: "Adv. Sunita Joshi",
    authorRole: "Judicial Services Mentor",
    readTime: "7 min read",
    date: "Feb 15, 2025",
    imageBg: "from-purple-700 to-violet-950",
  },
  {
    id: "notes-making-revision-strategy",
    title: "Short Notes & 3-Stage Revision Formula for Competitive Exams",
    excerpt:
      "Effective mind map and flowchart methods to revise 1000+ pages of vast syllabus in 24 hours.",
    category: "Exam Strategy",
    author: "Devanagari Editorial Team",
    authorRole: "Academic Research Wing",
    readTime: "4 min read",
    date: "Feb 10, 2025",
    imageBg: "from-amber-600 to-orange-800",
  },
  {
    id: "mp-gk-history-culture",
    title: "MP History & Culture: Important Dynasties & Tribal Heritage",
    excerpt:
      "Quiz and analytical articles based on the historical landscape of Gond, Bhil, and Bundelkhand-Baghelkhand.",
    category: "MPPSC",
    author: "Prof. Arvind Tiwari",
    authorRole: "History Faculty",
    readTime: "6 min read",
    date: "Jan 30, 2025",
    imageBg: "from-rose-600 to-red-900",
  },
];

const CATEGORIES = ["All", "MPPSC", "Judiciary", "Hindi Sahitya", "Exam Strategy"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Blogs</h1>
            <p className="text-sm text-gray-500 mt-1">Expert strategies, legal updates, and exam guidance.</p>
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
              placeholder="Search articles..."
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
            <h3 className="text-base font-bold text-gray-800">No articles found</h3>
            <p className="text-sm text-gray-500 mt-1">Try searching with different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                {/* Compact Image Banner */}
                <div
                  className={`h-28 bg-gradient-to-br ${post.imageBg} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}
                >
                  <div className="flex items-center justify-between z-10">
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
              </article>
            ))}
          </div>
        )}

        {/* COMPACT NEWSLETTER CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[10px] font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>Free Exam Digest</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">
              Get Latest Exam Notes & Blogs
            </h3>
            <p className="text-white/70 text-xs">
              Join 20,000+ students benefiting from Devanagari study guides weekly.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C61821] text-white font-bold text-xs shadow-md hover:bg-red-700 transition-all hover:scale-105"
          >
            Explore Catalog →
          </Link>
        </div>
      </main>
    </div>
  );
}
