"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { TeamMember } from "@/data/teamContent";
import {
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function TeamContent({ settings, items }: { settings: Record<string, string>; items: TeamMember[] }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
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
            <span className="text-[#C61821]">Team</span>
          </nav>
        </div>
      </section>

      {/* TEAM MEMBERS COMPACT GRID */}
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>{settings.badge1}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{settings.badge2}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-red-500" />
            <span>{settings.badge3}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 flex gap-3.5"
            >
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden bg-gray-100">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} width={110} height={110} unoptimized className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                      {member.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-base font-bold text-gray-900 group-hover:text-[#C61821] transition-colors leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#C61821] font-bold leading-snug mt-0.5 line-clamp-2">
                    {member.role}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 shrink-0 bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold px-2 py-1 rounded-md">
                    <Award className="w-3.5 h-3.5" /> {member.experience}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <GraduationCap className="w-3 h-3 text-gray-600" />
                    <span className="line-clamp-1">{member.qualification}</span>
                  </span>
                </div>

                <p className="text-[13px] sm:text-sm text-gray-500 leading-[1.55] mt-2 line-clamp-3 flex-1">
                  {member.bio}
                </p>

                <div className="flex items-center mt-3 pt-3 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md">
                    <BookOpen className="w-3.5 h-3.5 text-red-500" />
                    {member.dept}
                  </span>
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
              <span>{settings.ctaBadge}</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">
              {settings.ctaTitle}
            </h3>
            <p className="text-gray-300 text-xs">
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
