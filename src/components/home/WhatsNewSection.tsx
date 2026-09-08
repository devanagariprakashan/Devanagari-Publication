"use client";
import Link from "next/link";
import { BookOpen, Calendar, Percent } from "lucide-react";
import Image from "next/image";

const cards = [
  {
    title: "New Books",
    desc: "Latest additions to\nour collection",
    icon: BookOpen,
    href: "/shop?filter=new",
    image: "/books.png",
    isImgContain: true,
  },
  {
    title: "New Edition",
    desc: "Updated & revised\neditions",
    href: "/shop?filter=new",
    badge: "NEW",
    image: "/images/books/image-4.png",
    editionBadge: "2025-26",
  },
  {
    title: "Offer",
    desc: "Best deals on your\nfavorite books",
    icon: Percent,
    href: "/shop?filter=offer",
    image: "/discount coupon.png",
  },
  {
    title: "Coming Soon IU",
    desc: "Stay tuned for upcoming\nIU titles",
    icon: Calendar,
    href: "/shop?filter=coming-soon",
    image: "/cooming soon.png",
  },
];

export default function WhatsNewSection() {
  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="text-gray-900">What&apos;s </span>
            <span className="text-[#C61821]">New</span>
          </h2>
          <Link href="/shop" className="text-sm font-bold text-[#C61821] inline-flex items-center gap-1 hover:gap-1.5 transition-all">
            View All <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="group bg-[#FFF8F8]/60 hover:bg-white rounded-xl border border-gray-100 hover:border-red-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex items-center justify-between gap-3 min-h-[152px] transition-all overflow-hidden">
              <div className="flex flex-col min-w-0 shrink">
                {c.badge ? (
                  <span className="inline-flex bg-[#C61821] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md w-fit mb-2 tracking-wider">NEW</span>
                ) : c.icon ? (
                  <span className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#C61821] mb-2">
                    <c.icon className="w-4 h-4" />
                  </span>
                ) : null}
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{c.title}</h3>
                <p className="text-xs text-gray-500 whitespace-pre-line mt-1 leading-snug">{c.desc}</p>
                <span className="text-xs font-bold text-[#C61821] mt-3 inline-flex items-center gap-1">Explore <span>→</span></span>
              </div>
              <div className="shrink-0 relative w-[118px] h-[112px] sm:w-[136px] sm:h-[124px] flex items-center justify-center">
                {/* ponytail: using <img> for public assets with spaces, avoids Next encoding */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.title} className="w-full h-full object-contain object-right drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-[1.03] transition-transform" />
                {c.editionBadge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">{c.editionBadge}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
