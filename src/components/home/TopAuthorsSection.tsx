"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { BookData } from "./HeroBook3D";

export interface AuthorItem {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  category: "all" | "hindi" | "gs" | "ethics" | "law";
  booksCount: number;
  image: string;
  fallbackGradient: string;
  experience: string;
  bio: string;
  youtubeUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  books: { id: number | string; title: string; category: string; price: number; image: string }[];
}

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="white"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" /></svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface Props { onSelectBook?: (book: BookData) => void; authors?: AuthorItem[]; }

export default function TopAuthorsSection({ authors }: Props) {
  const [imgErr, setImgErr] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [sort, setSort] = useState("Featured");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = authors ?? [];

  const subjects = useMemo(() => ["All Subjects", ...Array.from(new Set(list.map((a) => a.shortRole).filter(Boolean)))], [list]);

  const filtered = useMemo(() => {
    let r = [...list];
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((a) => `${a.name} ${a.role} ${a.shortRole} ${a.bio}`.toLowerCase().includes(s));
    }
    if (subject !== "All Subjects") r = r.filter((a) => a.shortRole === subject);
    if (sort === "Name A-Z") r.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Books") r.sort((a, b) => b.booksCount - a.booksCount);
    return r;
  }, [list, q, subject, sort]);

  return (
    <section id="authors" className="py-6 sm:py-8 bg-[#FCFCFC] border-t border-gray-100">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls row — matches reference spacing */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search authors by name, subject or expertise..."
              className="w-full h-[42px] pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-0"
            />
          </div>
          {/* Subject */}
          <div className="relative w-full lg:w-[220px] shrink-0">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-[42px] px-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 appearance-none focus:outline-none focus:border-gray-300 cursor-pointer"
            >
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* Sort */}
          <div className="relative w-full lg:w-[200px] shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-[42px] px-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700 appearance-none focus:outline-none focus:border-gray-300 cursor-pointer"
            >
              <option value="Featured">Sort by: Featured</option>
              <option value="Name A-Z">Sort by: Name A-Z</option>
              <option value="Books">Sort by: Books</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid — 3 / 2 / 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex gap-3.5 relative">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden bg-gray-100">
                  {!imgErr[a.id] ? (
                    <Image src={a.image} alt={a.name} width={110} height={110} className="w-full h-full object-cover" onError={() => setImgErr((p) => ({ ...p, [a.id]: true }))} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${a.fallbackGradient} flex items-center justify-center text-white text-sm font-bold`}>
                      {a.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2 pr-1">
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-base font-bold text-gray-900 leading-tight truncate">{a.name}</h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{a.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 shrink-0 bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold px-2 py-1 rounded-md">
                    <BookOpen className="w-3.5 h-3.5" /> {a.booksCount} Book{a.booksCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-[13px] sm:text-sm text-gray-500 leading-[1.55] mt-2 line-clamp-3 flex-1">{a.bio}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Social icons — only render when the author has a URL */}
                  {(() => {
                    const socials = [
                      { url: a.youtubeUrl, label: "YouTube", node: <span className="w-6 h-6 rounded-[4px] bg-[#FF0000] flex items-center justify-center"><YoutubeIcon /></span> },
                      { url: a.linkedinUrl, label: "LinkedIn", node: <span className="w-6 h-6 rounded-[4px] bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold">in</span> },
                      { url: a.twitterUrl, label: "X (Twitter)", node: <span className="w-6 h-6 rounded-[4px] bg-black text-white flex items-center justify-center text-[10px] font-bold">𝕏</span> },
                      { url: a.instagramUrl, label: "Instagram", node: <span className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-[#FEDA77] via-[#D62976] to-[#4F5BD5] flex items-center justify-center"><InstagramIcon /></span> },
                    ];
                    const visible = socials.filter((s) => s.url);
                    if (visible.length === 0) return null;
                    return (
                      <div className="flex items-center gap-1.5">
                        {visible.map((s) => (
                          <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="transition-opacity hover:opacity-80">
                            {s.node}
                          </a>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Description toggle */}
                  <button
                    onClick={() => setOpenId((cur) => (cur === a.id ? null : a.id))}
                    className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold text-[#C61821] hover:text-[#A8131B] transition-colors cursor-pointer"
                    aria-expanded={openId === a.id}
                  >
                    Description
                    <ChevronDown className={`w-4 h-4 transition-transform ${openId === a.id ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* Expandable description + books by author (overlaps the card below) */}
                {openId === a.id && (
                  <div className="absolute inset-x-0 top-full z-30 mt-1 rounded-lg border border-gray-200 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] p-4">
                    <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed mb-3">{a.bio}</p>
                    {a.books.length > 0 ? (
                      <ul className="space-y-1.5">
                        {a.books.map((b) => (
                          <li key={b.id}>
                            <Link href={`/product/${b.id}`} className="group flex items-center gap-2 text-[13px] sm:text-sm text-gray-700 hover:text-[#C61821] transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C61821] shrink-0" />
                              <span className="truncate font-medium">{b.title}</span>
                              <span className="ml-auto shrink-0 text-gray-400 group-hover:text-[#C61821]">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-400">No books listed for this author yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No authors match your search.</p>}
      </div>
    </section>
  );
}
