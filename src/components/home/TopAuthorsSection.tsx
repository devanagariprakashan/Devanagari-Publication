"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
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
  books: { id: number; title: string; category: string; price: number; image: string }[];
}

export const TOP_AUTHORS: AuthorItem[] = [
  {
    id: "a2",
    name: "Mr. Mayank Jagdish Sharma",
    role: "Faculty, Hindi Sahitya And Vyakaran",
    shortRole: "Hindi Sahitya & Vyakaran",
    category: "hindi",
    booksCount: 4,
    image: "/images/authors/mayank-sharma.jpg",
    fallbackGradient: "from-red-500 to-amber-600",
    experience: "12+ Years Experience",
    bio: "Expert in Hindi language, grammar and literature. Known for simplified explanations and student-friendly approach.",
    books: [
      { id: 201, title: "Samanya Hindi Exam Vyakaran", category: "Hindi Grammar", price: 900, image: "/images/books/image-2.png" },
      { id: 202, title: "Nibandh Sanhita", category: "Essay Writing", price: 850, image: "/images/books/image-3.png" },
    ],
  },
  {
    id: "a4",
    name: "Mr. Shubham Gupta",
    role: "GS Faculty & Prelims Strategist",
    shortRole: "GS & Current Affairs",
    category: "gs",
    booksCount: 3,
    image: "/images/authors/shubham-gupta.jpg",
    fallbackGradient: "from-blue-600 to-cyan-600",
    experience: "8+ Years Experience",
    bio: "Renowned for his structured approach to General Studies and Prelims preparation.",
    books: [{ id: 205, title: "Madhya Pradesh Samanya Gyan", category: "State GS", price: 750, image: "/images/books/image-8.png" }],
  },
  {
    id: "a3",
    name: "Mr. Anand Mishra",
    role: "Director - Raksha Academy · Faculty - Ethics",
    shortRole: "Ethics & Integrity (Paper 4)",
    category: "ethics",
    booksCount: 1,
    image: "/images/authors/anand-mishra.jpg",
    fallbackGradient: "from-emerald-600 to-teal-700",
    experience: "15+ Years Experience",
    bio: "Specializes in Ethics, Integrity and Aptitude with real-world examples and case studies.",
    books: [
      { id: 203, title: "Darshan, Manovigyan evam Lok Prashasan", category: "Ethics Paper-4", price: 899, image: "/images/books/image-4.png" },
      { id: 204, title: "Bhartiya Samaj evam Mudde", category: "Sociology Paper-2", price: 799, image: "/images/books/image-5.png" },
    ],
  },
  {
    id: "a5",
    name: "Dr. Sunita Trivedi",
    role: "Dean & Faculty - Law & Judicial Exams",
    shortRole: "Law & Judicial Services",
    category: "law",
    booksCount: 0,
    image: "/images/authors/sunita-trivedi.jpg",
    fallbackGradient: "from-purple-600 to-indigo-700",
    experience: "14+ Years Legal Academics",
    bio: "Expert in Law, Polity and Judicial Exams with years of teaching experience.",
    books: [{ id: 206, title: "Judiciary Civil Procedure & Evidence", category: "Civil Judge", price: 950, image: "/images/books/image-9.png" }],
  },
  {
    id: "a6",
    name: "Prof. Rajeshwar Sharma",
    role: "Senior Academician & MP Historian",
    shortRole: "MP History & Culture",
    category: "gs",
    booksCount: 0,
    image: "/images/authors/rajeshwar-sharma.jpg",
    fallbackGradient: "from-amber-600 to-orange-700",
    experience: "22+ Years Research",
    bio: "A well-known historian and academician with deep knowledge of Madhya Pradesh's history and culture.",
    books: [{ id: 208, title: "MP Itihas, Kala evam Janjatiya Sanskriti", category: "History Paper-1", price: 820, image: "/images/books/image-11.png" }],
  },
  {
    id: "a7",
    name: "Adv. Vivek Deshmukh",
    role: "Constitutional Law & Polity Expert",
    shortRole: "Polity & Constitution",
    category: "law",
    booksCount: 0,
    image: "/images/authors/vivek-deshmukh.jpg",
    fallbackGradient: "from-slate-700 to-slate-900",
    experience: "10+ Years Practice",
    bio: "Specializes in Constitutional Law, Polity and current legal developments.",
    books: [{ id: 209, title: "Bhartiya Samvidhan evam Rajvyavastha", category: "Polity Paper-2", price: 880, image: "/images/books/image-12.png" }],
  },
];

interface Props { onSelectBook?: (book: BookData) => void; authors?: AuthorItem[]; }

const SUBJECTS = ["All Subjects", "Hindi Sahitya & Vyakaran", "GS & Current Affairs", "Ethics & Integrity (Paper 4)", "Law & Judicial Services", "MP History & Culture", "Polity & Constitution"];

export default function TopAuthorsSection({ authors }: Props) {
  const [imgErr, setImgErr] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [sort, setSort] = useState("Featured");

  const list = authors ?? TOP_AUTHORS;

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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
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
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
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
                <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden bg-gray-100">
                  {!imgErr[a.id] ? (
                    <Image src={a.image} alt={a.name} width={80} height={80} className="w-full h-full object-cover" onError={() => setImgErr((p) => ({ ...p, [a.id]: true }))} />
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
                    <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate">{a.name}</h3>
                    <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{a.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 shrink-0 bg-[#FFF1F2] text-[#E11D48] text-[11px] font-semibold px-2 py-1 rounded-md">
                    <BookOpen className="w-3 h-3" /> {a.booksCount} Book{a.booksCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-[11.5px] text-gray-500 leading-[1.5] mt-2 line-clamp-3 flex-1">{a.bio}</p>

                <div className="flex items-center mt-3">
                  {/* Social icons — compact, per reference; no fake URLs */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-[4px] bg-[#FF0000] flex items-center justify-center"><span className="w-2.5 h-2.5 bg-white rounded-[1px] flex items-center justify-center text-[7px] font-bold text-[#FF0000]">▶</span></span>
                    <span className="w-6 h-6 rounded-[4px] bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold">in</span>
                    <span className="w-6 h-6 rounded-[4px] bg-black text-white flex items-center justify-center text-[10px] font-bold">𝕏</span>
                    <span className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-[#FEDA77] via-[#D62976] to-[#4F5BD5] flex items-center justify-center text-white text-[10px]">◎</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No authors match your search.</p>}
      </div>
    </section>
  );
}
