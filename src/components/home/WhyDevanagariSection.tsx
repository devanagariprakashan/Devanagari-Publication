"use client";

import React from "react";
import {
  CheckCircle2,
  Users2,
  BookCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export default function WhyDevanagariSection() {
  const highlights = [
    {
      icon: BookCheck,
      title: "100% Exam-Centric Syllabus",
      hindi: "नवीनतम परीक्षा पैटर्न अनुसार",
      desc: "Updated in accordance with the latest MPPSC, Civil Judge & Judiciary syllabus with zero irrelevant content.",
    },
    {
      icon: Users2,
      title: "Written by Senior Educators & Toppers",
      hindi: "अनुभवी शिक्षकों व टॉपर्स द्वारा रचित",
      desc: "Authored by senior academicians, retired civil servants and judicial exam rank holders.",
    },
    {
      icon: Sparkles,
      title: "Simplified Hindi & English Terminology",
      hindi: "सहज एवं प्रामाणिक भाषा शैली",
      desc: "Easy to digest language, visual flowcharts, mind maps, and standard legal maxims.",
    },
    {
      icon: Zap,
      title: "Prompt Dispatch & Safe Packing",
      hindi: "त्वरित डिलीवरी एवं सुरक्षित पैकिंग",
      desc: "Waterproof protective packaging with same-day express dispatch across all states of India.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-[#C61821] text-xs font-bold uppercase tracking-wider">
              27+ Years of Trust &amp; Excellence
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-serif leading-tight">
              Why 50,000+ Aspirants Rely on{" "}
              <span className="text-[#C61821] font-devanagari font-bold">
                देवनागरी
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Founded with the vision to provide authentic, highly accurate, and
              affordable study material for State Civil Services and Judicial
              Examinations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C61821] shrink-0" />
                <span className="text-sm text-gray-700 font-medium">
                  Direct answers to standard Mains questions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C61821] shrink-0" />
                <span className="text-sm text-gray-700 font-medium">
                  Includes landmark High Court &amp; Supreme Court judgments
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C61821] shrink-0" />
                <span className="text-sm text-gray-700 font-medium">
                  Free online updates for current affairs &amp; amendments
                </span>
              </div>
            </div>
          </div>

          {/* Right Column Highlights Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFF9F9] border border-red-100/60 hover:border-red-200 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-11 h-11 rounded-xl bg-white text-[#C61821] shadow-sm border border-red-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="font-devanagari text-[11px] font-semibold text-[#C61821] block mb-1">
                    {item.hindi}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
