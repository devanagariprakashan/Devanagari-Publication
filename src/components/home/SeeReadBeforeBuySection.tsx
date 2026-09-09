"use client";
import Link from "next/link";

export default function SeeReadBeforeBuySection() {
  return (
    <section className="py-8 sm:py-10">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          <span className="text-[#C61821]">See / Read</span> <span className="text-gray-900">Before You Buy</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Demo PDF */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex gap-4 items-center overflow-hidden">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <span className="bg-[#C61821] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">PDF</span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">Demo PDF</h3>
                  <p className="text-xs text-gray-500">Read sample pages</p>
                </div>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-1.5 bg-white border border-red-100 hover:border-[#C61821] text-[#C61821] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                View Demo PDF <span>→</span>
              </Link>
            </div>
            <div className="shrink-0 w-[198px] sm:w-[252px] flex gap-2 items-center justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/books/sample-page-1.svg" alt="sample1" className="w-[104px] sm:w-[128px] h-[132px] sm:h-[152px] object-cover rounded-md border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-white" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/books/sample-page-2.svg" alt="sample2" className="w-[104px] sm:w-[128px] h-[132px] sm:h-[152px] object-cover rounded-md border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-white" />
            </div>
          </div>

          {/* Watch Before You Buy */}
          <div className="bg-[#FFF5F5] rounded-2xl border border-red-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex gap-4 items-center overflow-hidden">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 text-red-600">
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="currentColor"><path d="M21.2 2.2a2.8 2.8 0 0 0-2-2C17.5 0 11 0 11 0S4.5 0 2.8.2a2.8 2.8 0 0 0-2 2A29 29 0 0 0 0 8a29 29 0 0 0 .8 5.8 2.8 2.8 0 0 0 2 2c1.7.2 8.2.2 8.2.2s6.5 0 8.2-.2a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 8a29 29 0 0 0-.8-5.8zM9 11.5V4.5l6 3.5-6 3.5z"/></svg>
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">Watch Before You Buy</h3>
                  <p className="text-xs text-gray-500">About this Book</p>
                </div>
              </div>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-white border border-red-100 hover:border-[#C61821] text-[#C61821] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                Watch on YouTube <span>→</span>
              </a>
            </div>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="shrink-0 w-[198px] sm:w-[268px] relative rounded-xl overflow-hidden border border-gray-200 shadow-sm block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/watch-before-you-buy.png" alt="Watch Before You Buy - Samanya Hindi Evam Vyakaran" className="w-full h-[138px] sm:h-[156px] object-cover" />
            </a>
          </div>
        </div>
    </section>
  );
}
