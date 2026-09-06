"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Users,
  ArrowRight,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  dept: string;
  experience: string;
  qualification: string;
  bio: string;
  gradient: string;
}

const CORE_TEAM: TeamMember[] = [
  {
    name: "Mr. Mayank Jagdish Sharma",
    role: "Chief Academic Director & Author",
    dept: "Hindi Sahitya & Vyakaran",
    experience: "12+ Years Exp.",
    qualification: "M.A. Hindi Lit., UGC-NET",
    bio: "Renowned Hindi literature & grammar mentor. Guided 15,000+ selected candidates.",
    gradient: "from-red-600 to-amber-700",
  },
  {
    name: "Adv. Sunita Joshi",
    role: "Head of Legal Studies",
    dept: "Law & Judiciary",
    experience: "14+ Years Exp.",
    qualification: "LL.M., Ex-Public Prosecutor",
    bio: "Pioneering author in New Criminal Laws 2024 and Civil Judge Mains answer writing.",
    gradient: "from-blue-700 to-indigo-900",
  },
  {
    name: "Dr. Rajesh Verma",
    role: "Senior Research Fellow",
    dept: "General Studies & Ethics",
    experience: "16+ Years Exp.",
    qualification: "Ph.D., Former PSC Panelist",
    bio: "Specialist in MP GK, Indian Polity, and Ethics. Authored 8 benchmark textbooks.",
    gradient: "from-emerald-700 to-teal-900",
  },
  {
    name: "Prof. Arvind Tiwari",
    role: "Senior Faculty & Researcher",
    dept: "History & Heritage",
    experience: "10+ Years Exp.",
    qualification: "M.Phil History, Rankholder",
    bio: "Expert on MP's tribal dynasties, modern Indian freedom struggle, and heritage.",
    gradient: "from-purple-700 to-violet-950",
  },
  {
    name: "Dr. Kavita Sharma",
    role: "Chief Content Editor",
    dept: "Editorial & QC",
    experience: "9+ Years Exp.",
    qualification: "Ph.D. Linguistics",
    bio: "Ensures 100% factual accuracy, impeccable grammar, and syllabus synchronization.",
    gradient: "from-amber-600 to-rose-700",
  },
  {
    name: "Amitabh Chouhan",
    role: "Director of Digital Learning",
    dept: "Technology",
    experience: "8+ Years Exp.",
    qualification: "B.Tech, MBA",
    bio: "Drives rapid student feedback incorporation and digital resources for aspirants.",
    gradient: "from-slate-700 to-zinc-900",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      {/* HEADER BREADCRUMB */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Our Team</h1>
            <p className="text-sm text-gray-500 mt-1">Meet our expert faculty, authors, and researchers.</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Team</span>
          </nav>
        </div>
      </section>

      {/* TEAM MEMBERS COMPACT GRID */}
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>100% Syllabus Aligned</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>15+ Yrs Academic Pedigree</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-red-500" />
            <span>50k+ Students Guided</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {CORE_TEAM.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Compact Banner */}
              <div
                className={`h-24 bg-gradient-to-br ${member.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}
              >
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase self-start">
                  {member.dept}
                </span>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500" />
              </div>

              {/* Profile Details */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C61821] transition-colors mb-1 line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-[11px] font-bold text-[#C61821] mb-2">
                  {member.role}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md mb-2 w-fit">
                  <GraduationCap className="w-3 h-3 text-gray-600" />
                  <span className="line-clamp-1">{member.qualification}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-3">
                  {member.bio}
                </p>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500 mt-auto">
                  <span className="font-semibold text-gray-700">
                    {member.experience}
                  </span>
                  <Link
                    href="/shop"
                    className="font-bold text-[#C61821] hover:underline flex items-center gap-1"
                  >
                    <span>Books</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* COMPACT AUTHOR INVITATION */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-800">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>Join As An Author</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">
              Want to publish your book with Devanagari?
            </h3>
            <p className="text-gray-300 text-xs">
              If you are an educator or researcher, contact our editorial team to share your manuscript.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C61821] text-white font-bold text-xs shadow-md hover:bg-red-700 transition-all hover:scale-105"
          >
            Contact Editorial Board →
          </Link>
        </div>
      </main>
    </div>
  );
}
