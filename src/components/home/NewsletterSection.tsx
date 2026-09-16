"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  ArrowRight,
  Send,
  Tag,
  BookOpen,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-4 sm:py-4 md:py-4 mb-6 bg-gradient-to-b from-white via-[#FFFBFB] to-stone-50/60 relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Outer Newsletter Card */}
        <div className="relative rounded-[5px] sm:rounded-[5px] bg-gradient-to-br from-white via-[#FFF9F9] to-[#FFF3F3] border border-red-100/90 shadow-xl shadow-red-950/5 p-3 sm:p-2 md:p-2 lg:p-3 overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[420px] h-[420px] bg-rose-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center py-3 px-2 ">
            
            {/* Left Column: Content, Form & Feature Badges */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start order-2 lg:order-1">
              
              {/* Tag with Red Line */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 text-center lg:text-left w-full">
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#C61821] uppercase font-sans">
                  NEWSLETTER
                </span>
                <span className="w-8 h-[2px] bg-[#C61821] rounded-full inline-block" />
              </div>

              {/* Headings */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center lg:text-left font-bold text-gray-900 leading-[1.15] tracking-tight">
                Stay in the loop. <br />
                <span className="text-[#C61821]">Never miss an update.</span>
              </h2>


              {/* Email Form */}
              <div className="mt-6 max-w-xl w-full">
                {isSubscribed ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-[5px] p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in zoom-in-95 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">You&apos;re subscribed!</p>
                      <p className="text-xs text-emerald-700">Thank you for joining Devanagari Publication newsletter.</p>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="relative bg-white rounded-[5px] sm:rounded-[5px] border border-stone-200 shadow-sm hover:border-red-200 focus-within:border-[#C61821] focus-within:ring-2 focus-within:ring-red-100 transition-all p-1.5 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  >
                    <div className="flex items-center gap-2 flex-grow">
                      <div className="pl-2 sm:pl-3.5 flex items-center pointer-events-none text-stone-400 shrink-0">
                        <Mail className="w-5 h-5 text-[#C61821]/70" />
                      </div>

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-transparent px-1 sm:px-3 py-1.5 sm:py-0 text-xs sm:text-sm text-gray-800 placeholder-stone-400 focus:outline-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#C61821] hover:bg-[#a5131b] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-[4px] sm:rounded-[5px] font-semibold text-xs sm:text-sm flex justify-center items-center gap-2 shadow-md shadow-red-900/20 hover:shadow-lg transition-all active:scale-95 shrink-0 group cursor-pointer"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </form>
                )}
              </div>

              {/* 3 Feature Badges Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-6 pt-2 max-w-xl w-full">
                {/* Badge 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-100/80 flex items-center justify-center text-[#C61821] shrink-0 shadow-xs">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
                      Latest Releases
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      Be the first to know
                    </p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-100/80 flex items-center justify-center text-[#C61821] shrink-0 shadow-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
                      Exclusive Offers
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      Special deals for you
                    </p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 border border-red-100/80 flex items-center justify-center text-[#C61821] shrink-0 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
                      Exam Updates
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      Stay exam ready
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Guarantee Note */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mt-5 ml-3">
                <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>We respect your privacy. Unsubscribe anytime.</span>
              </div>
            </div>

            {/* Right Column: 3D Illustration Graphic */}
            <div className="lg:col-span-5 w-full flex items-center justify-center relative order-1 lg:order-2">
              {/* Radial glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-100/50 via-rose-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative w-full max-w-[320px] sm:max-w-[320px] lg:max-w-[480px] aspect-[4/3] flex items-center justify-center">
                <Image
                  src="/images/newsletters/news.png"
                  alt="Devanagari Newsletter and Updates"
                  fill 
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 480px"
                  className="object-contain drop-shadow-2xl hover:scale-103 transition-transform duration-500 ease-out"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
