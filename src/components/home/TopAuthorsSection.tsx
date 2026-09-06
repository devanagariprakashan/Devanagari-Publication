"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
  GraduationCap,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
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
  books: {
    id: number;
    title: string;
    category: string;
    price: number;
    image: string;
  }[];
}

export const TOP_AUTHORS: AuthorItem[] = [
  {
    id: "a2",
    name: "Mr. Mayank Jagdish Sharma",
    role: "Faculty, Hindi Sahitya And Vyakaran",
    shortRole: "Hindi Sahitya & Vyakaran",
    category: "hindi",
    booksCount: 2,
    image: "/images/authors/mayank-sharma.jpg",
    fallbackGradient: "from-red-500 to-amber-600",
    experience: "12+ Years Experience",
    bio: "Renowned Hindi literature & grammar mentor for MPPSC, Civil Services and State exams. Guided 15,000+ selected candidates.",
    books: [
      {
        id: 201,
        title: "Samanya Hindi Exam Vyakaran",
        category: "Hindi Grammar",
        price: 900,
        image: "/images/books/image-2.png",
      },
      {
        id: 202,
        title: "Nibandh Sanhita",
        category: "Essay Writing",
        price: 850,
        image: "/images/books/image-3.png",
      },
    ],
  },
  {
    id: "a4",
    name: "Mr. Shubham Gupta",
    role: "GS Faculty & Prelims Strategist",
    shortRole: "GS & Current Affairs",
    category: "gs",
    booksCount: 1,
    image: "/images/authors/shubham-gupta.jpg",
    fallbackGradient: "from-blue-600 to-cyan-600",
    experience: "8+ Years Experience",
    bio: "Top General Studies educator specializing in high-yield Prelims notes, quick revision charts and analytical GS.",
    books: [
      {
        id: 205,
        title: "Madhya Pradesh Samanya Gyan",
        category: "State GS",
        price: 750,
        image: "/images/books/image-8.png",
      },
    ],
  },
  {
    id: "a3",
    name: "Mr. Anand Mishra",
    role: "Director - Raksha Academy • Faculty - Ethics",
    shortRole: "Ethics & Integrity (Paper 4)",
    category: "ethics",
    booksCount: 2,
    image: "/images/authors/anand-mishra.jpg",
    fallbackGradient: "from-emerald-600 to-teal-700",
    experience: "15+ Years Experience",
    bio: "Director of Raksha Academy, senior philosopher & ethics mentor known for case-study frameworks in Paper-4.",
    books: [
      {
        id: 203,
        title: "Darshan, Manovigyan evam Lok Prashasan",
        category: "Ethics Paper-4",
        price: 899,
        image: "/images/books/image-4.png",
      },
      {
        id: 204,
        title: "Bhartiya Samaj evam Mudde",
        category: "Sociology Paper-2",
        price: 799,
        image: "/images/books/image-5.png",
      },
    ],
  },
  {
    id: "a5",
    name: "Dr. Sunita Trivedi",
    role: "Dean & Faculty - Law & Judicial Exams",
    shortRole: "Law & Judicial Services",
    category: "law",
    booksCount: 3,
    image: "/images/authors/sunita-trivedi.jpg",
    fallbackGradient: "from-purple-600 to-indigo-700",
    experience: "14+ Years Legal Academics",
    bio: "Authoritative jurist and mentor for Civil Judge, ADPO and Higher Judicial Services across Madhya Pradesh, UP & Rajasthan.",
    books: [
      {
        id: 206,
        title: "Judiciary Civil Procedure & Evidence",
        category: "Civil Judge",
        price: 950,
        image: "/images/books/image-9.png",
      },
      {
        id: 207,
        title: "Bharatiya Nyaya Sanhita Simplified",
        category: "Bare Acts 2024",
        price: 890,
        image: "/images/books/image-10.png",
      },
    ],
  },
  {
    id: "a6",
    name: "Prof. Rajeshwar Sharma",
    role: "Senior Academician & MP Historian",
    shortRole: "MP History & Culture",
    category: "gs",
    booksCount: 2,
    image: "/images/authors/rajeshwar-sharma.jpg",
    fallbackGradient: "from-amber-600 to-orange-700",
    experience: "22+ Years Research",
    bio: "Distinguished historian, researcher and state awardee specializing in ancient and medieval tribal history of Central India.",
    books: [
      {
        id: 208,
        title: "MP Itihas, Kala evam Janjatiya Sanskriti",
        category: "History Paper-1",
        price: 820,
        image: "/images/books/image-11.png",
      },
    ],
  },
  {
    id: "a7",
    name: "Adv. Vivek Deshmukh",
    role: "Constitutional Law & Polity Expert",
    shortRole: "Polity & Constitution",
    category: "law",
    booksCount: 2,
    image: "/images/authors/vivek-deshmukh.jpg",
    fallbackGradient: "from-slate-700 to-slate-900",
    experience: "10+ Years Practice",
    bio: "Supreme Court & High Court advocate holding masterclasses on Constitution, Governance and Public Policy.",
    books: [
      {
        id: 209,
        title: "Bhartiya Samvidhan evam Rajvyavastha",
        category: "Polity Paper-2",
        price: 880,
        image: "/images/books/image-12.png",
      },
    ],
  },
];

interface TopAuthorsSectionProps {
  onSelectBook?: (book: BookData) => void;
  authors?: AuthorItem[];
}

export default function TopAuthorsSection({
  onSelectBook,
  authors,
}: TopAuthorsSectionProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const list = authors ?? TOP_AUTHORS;

  const handleImageError = (authorId: string) => {
    setImageErrorMap((prev) => ({ ...prev, [authorId]: true }));
  };

  return (
    <section
      id="authors"
      className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/70 border-t border-stone-200/60 relative overflow-hidden"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* COMPACT & MODERN HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 sm:mb-9 gap-4">
          <div className="max-w-2xl">
            {/* Top Category Tag */}
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#C61821] mb-2 px-2.5 py-0.5 rounded-md bg-red-50/90 border border-red-100">
              <Sparkles className="w-3.5 h-3.5 text-[#C61821]" />
              Top Authors &amp; Faculty
            </div>

            {/* Main Title */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 leading-[1.15] tracking-tight">
              Voices you can trust
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 mt-1.5 text-xs sm:text-sm md:text-[15px] leading-relaxed">
              Distinguished scholars, jurists and educators — the visionary minds behind every Devanagari title.
            </p>
          </div>

          {/* View all authors button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById("bestsellers");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C61821] hover:text-[#991016] bg-red-50/60 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-all duration-200 border border-red-100/80 group"
            >
              <span>View all authors</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* RESPONSIVE & COMPACT AUTHORS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
          {list.map((author) => {
            const hasImgError = imageErrorMap[author.id];

            return (
              <div
                key={author.id}
                onClick={() => setSelectedAuthor(author)}
                className="group relative bg-white/80 hover:bg-white rounded-[5px] p-3 sm:p-3.5 border border-stone-200/70 hover:border-[#C61821]/30 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1"
              >
                {/* Avatar with Ring & Verified Badge */}
                <div className="relative mx-auto mt-1 mb-3">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden ring-[3px] ring-stone-100 shadow-md group-hover:ring-[#C61821]/30 group-hover:shadow-red-900/10 group-hover:shadow-xl transition-all duration-300 bg-stone-100">
                    {!hasImgError ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 120px"
                        className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={() => handleImageError(author.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-tr ${author.fallbackGradient} flex items-center justify-center text-white font-serif font-bold text-xl`}
                      >
                        {author.name
                          .split(" ")
                          .filter((p) => !p.toLowerCase().includes("mr.") && !p.toLowerCase().includes("dr.") && !p.toLowerCase().includes("prof.") && !p.toLowerCase().includes("adv."))
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Verified Scholar Badge */}
                  <div
                    className="absolute -bottom-1 right-0 sm:right-1 bg-[#C61821] text-white p-1 rounded-full shadow-md ring-2 ring-white"
                    title="Devanagari Verified Author"
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Author Name */}
                <h3 className="font-serif text-[13px] sm:text-[14px] md:text-[15px] font-bold text-gray-900 leading-tight group-hover:text-[#C61821] transition-colors line-clamp-1 w-full px-1">
                  {author.name}
                </h3>

                {/* Role / Subject */}
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-snug line-clamp-2 min-h-[32px] sm:min-h-[36px] w-full px-1">
                  {author.role}
                </p>

                {/* Book count tag & Action */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 w-full flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C61821] bg-red-50/80 px-2.5 py-0.5 rounded-full group-hover:bg-[#C61821] group-hover:text-white transition-all duration-200">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>{author.booksCount} {author.booksCount === 1 ? "Book" : "Books"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK VIEW AUTHOR MODAL */}
      {selectedAuthor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedAuthor(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-[5px] shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6 relative">
              <button
                onClick={() => setSelectedAuthor(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-[5px] overflow-hidden ring-4 ring-white/20 shrink-0 shadow-lg bg-stone-800">
                  {!imageErrorMap[selectedAuthor.id] ? (
                    <Image
                      src={selectedAuthor.image}
                      alt={selectedAuthor.name}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(selectedAuthor.id)}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-tr ${selectedAuthor.fallbackGradient} flex items-center justify-center text-white font-serif font-bold text-xl`}
                    >
                      {selectedAuthor.name
                        .split(" ")
                        .filter((p) => !p.toLowerCase().includes("mr.") && !p.toLowerCase().includes("dr."))
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ffffff] bg-[#C61821]/10 px-2 py-1 rounded-md mb-1 border border-[#C61821]/20">
                    <Award className="w-3 h-3" />
                    Verified Author
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                    {selectedAuthor.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                    {selectedAuthor.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#C61821]" />
                  About the Author
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {selectedAuthor.bio}
                </p>
              </div>

              {/* Authored Books */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#C61821]" />
                    Authored Titles ({selectedAuthor.books.length})
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {selectedAuthor.books.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white hover:bg-red-50/40 border border-stone-200 hover:border-red-200 transition-all duration-200 group/book"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 bg-stone-100 rounded shadow-xs overflow-hidden shrink-0">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover/book:text-[#C61821] transition-colors">
                            {book.title}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {book.category} • ₹{book.price}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAuthor(null);
                          if (onSelectBook) {
                            onSelectBook({
                              id: book.id,
                              title: book.title,
                              author: selectedAuthor.name,
                              subject: book.category,
                              category: book.category,
                              price: book.price,
                              originalPrice: Math.round(book.price * 1.15),
                              rating: 4.9,
                              reviewsCount: 840,
                              coverType: "hindi",
                              bgColor: "from-[#8B151B] via-[#A81820] to-[#5C0A0E]",
                              textColor: "#FFFFFF",
                              accentColor: "#FDE047",
                              image: book.image,
                            });
                          } else {
                            const el = document.getElementById("handpicked");
                            el?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C61821] bg-red-50 hover:bg-[#C61821] hover:text-white px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {selectedAuthor.experience}
              </span>
              <button
                onClick={() => {
                  setSelectedAuthor(null);
                  const el = document.getElementById("handpicked");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C61821] hover:underline"
              >
                <span>Browse all books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
