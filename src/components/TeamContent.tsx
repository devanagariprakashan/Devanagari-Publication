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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Compact Banner */}
              <div
                className={`h-24 bg-gradient-to-br ${member.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}
              >
                {member.image && <><Image src={member.image} alt={member.name} fill unoptimized sizes="400px" className="object-cover" /><div className="absolute inset-0 bg-black/20" /></>}
                <span className="relative z-10 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase self-start">
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

                <div className="pt-3 border-t border-gray-50 flex items-center text-[11px] text-gray-500 mt-auto">
                  <span className="font-semibold text-gray-700">
                    {member.experience}
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
