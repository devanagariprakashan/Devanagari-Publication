"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#16263F";
const RED = "#C61821";

// ponytail: slide covers are stand-in renders until the real Kashi artwork ships.
// Swap the `cover` path in FALLBACK_SLIDES (and update thumb #1) — one-line change.
const FALLBACK_SLIDES = [
  {
    id: 1,
    badge: "NEW RELEASE",
    kicker: "नई पुस्तक रिलीज़",
    title: "काशी अनादि अनन्त",
    subtitle: "आस्था, इतिहास और संस्कृति का अद्भुत संगम",
    cta: "देखें विवरण",
    href: "/shop?filter=new",
    cover: "/images/books/image-2.png",
    bg: "linear-gradient(120deg, #F9EDDC 0%, #F3DFC4 55%, #EAD3AF 100%)",
  },
  {
    id: 2,
    badge: "NEW EDITION",
    kicker: "नवीन आपराधिक कानून",
    title: "भारतीय न्याय संहिता",
    subtitle: "BNS 2023/2024 — नई धाराओं की सरल व्याख्या",
    cta: "पुस्तक देखें",
    href: "/product/106",
    cover: "/images/books/image-5.png",
    bg: "linear-gradient(120deg, #F8ECD8 0%, #F0D8B4 55%, #E3C498 100%)",
  },
  {
    id: 3,
    badge: "2025-26 EDITION",
    kicker: "परीक्षा विशेष",
    title: "मध्य प्रदेश सामान्य ज्ञान",
    subtitle: "मानचित्र, सारणी एवं तथ्यों का संपूर्ण संकलन",
    cta: "पुस्तक देखें",
    href: "/product/105",
    cover: "/images/books/image-4.png",
    bg: "linear-gradient(120deg, #FAEFDE 0%, #F2DFC0 55%, #E8CEA6 100%)",
  },
  {
    id: 4,
    badge: "BESTSELLER",
    kicker: "संपूर्ण अध्ययन सामग्री",
    title: "आधुनिक हिन्दी व्याकरण",
    subtitle: "व्याकरण, रचना एवं भाषा चिंतन की मानक पुस्तक",
    cta: "पुस्तक देखें",
    href: "/product/103",
    cover: "/images/books/image-12.png",
    bg: "linear-gradient(120deg, #F6EADC 0%, #EED8B9 55%, #DFC093 100%)",
  },
];

const FALLBACK_UPDATES = [
  {
    title: "नई पुस्तक रिलीज़: काशी अनादि अनन्त",
    date: "12 Sep 2025",
    image: "/images/books/image-2.png",
    href: "/shop?filter=new",
  },
  {
    title: "लेखक परिचय: भारतीय संस्कृति और आधुनिक समाज",
    date: "08 Sep 2025",
    image: "/images/authors/mayank-sharma.jpg",
    href: "/authors",
  },
  {
    title: "आगामी प्रकाशन",
    desc: "जल्द आ रही हैं नई पुस्तकें",
    date: "05 Sep 2025",
    image: "/images/books/image-10.png",
    href: "/shop?filter=coming-soon",
  },
  {
    title: "पुस्तक मेला 2025",
    desc: "हम नई दिल्ली विश्व पुस्तक मेले में भाग ले रहे हैं",
    date: "01 Sep 2025",
    image: "/books.png",
    href: "/announcements",
  },
  {
    title: "नवीन संस्करण: सामान्य हिन्दी एवं व्याकरण",
    desc: "तीसरा संस्करण 2025-26 अब उपलब्ध",
    date: "28 Aug 2025",
    image: "/images/books/image-3.png",
    href: "/product/101",
  },
  {
    title: "MP GK 2025-26 का नया संस्करण आया",
    desc: "नवीनतम मानचित्र एवं आंकड़ों सहित",
    date: "22 Aug 2025",
    image: "/images/books/image-4.png",
    href: "/product/105",
  },
  {
    title: "BNS 2023/2024 पर विशेष लेख शृंखला",
    desc: "नई धाराओं की सरल व्याख्या — भाग 1",
    date: "15 Aug 2025",
    image: "/images/books/image-5.png",
    href: "/product/106",
  },
  {
    title: "UPSC प्रिलिम्स मास्टर गाइड उपलब्ध",
    desc: "15 वर्षों के हल प्रश्नपत्र हिंदी माध्यम में",
    date: "10 Aug 2025",
    image: "/images/books/upsc-master.png",
    href: "/product/109",
  },
];

// ponytail: feed rotates one row at a time (30s), circular window over the pool.
const FEED_STEP_MS = 30_000;
const FEED_FADE_MS = 650;
const FEED_SIZE = 4;

// Per-slide warm gradients, cycled by index for DB rows.
const SLIDE_BGS = FALLBACK_SLIDES.map((s) => s.bg);

type SlideView = (typeof FALLBACK_SLIDES)[number];
type UpdateView = (typeof FALLBACK_UPDATES)[number];

export default function WhatsNewSection() {
  const [slides, setSlides] = useState<SlideView[]>(FALLBACK_SLIDES);
  const [updates, setUpdates] = useState<UpdateView[]>(FALLBACK_UPDATES);
  const [active, setActive] = useState(0);
  const [feedStart, setFeedStart] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const prev = () => setActive((a) => (a === 0 ? slides.length - 1 : a - 1));
  const next = () => setActive((a) => (a === slides.length - 1 ? 0 : a + 1));

  const start = updates.length ? ((feedStart % updates.length) + updates.length) % updates.length : 0;
  const feedSize = Math.min(FEED_SIZE, updates.length);
  const shown = Array.from({ length: feedSize }, (_, k) => updates[(start + k) % updates.length]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const supabase = createClient();
      const [slidesRes, updatesRes] = await Promise.all([
        supabase.from("whats_new_slides").select("*").eq("is_active", true).order("sort"),
        supabase.from("latest_updates").select("*").eq("is_active", true).order("sort"),
      ]);
      if (cancelled) return;
      if (!slidesRes.error && slidesRes.data && slidesRes.data.length > 0) {
        setSlides(
          slidesRes.data.map((row, i) => ({
            id: row.id,
            badge: row.badge ?? "NEW RELEASE",
            kicker: row.kicker ?? "",
            title: row.title,
            subtitle: row.subtitle ?? "",
            cta: row.cta ?? "पुस्तक देखें",
            href: row.href ?? "/shop",
            cover: row.cover ?? "/images/books/image-2.png",
            bg: SLIDE_BGS[i % SLIDE_BGS.length],
          }))
        );
        setActive((a) => (a >= slidesRes.data!.length ? 0 : a));
      }
      if (!updatesRes.error && updatesRes.data && updatesRes.data.length > 0) {
        setUpdates(
          updatesRes.data.map((row) => ({
            title: row.title,
            desc: row.note ?? undefined,
            date: row.date_text ?? "",
            image: row.image ?? "/images/books/image-2.png",
            href: row.href ?? "/shop",
          }))
        );
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setFeedStart((s) => (s + 1) % updates.length);
        setFadingOut(false);
      }, FEED_FADE_MS);
    }, FEED_STEP_MS);
    return () => clearInterval(t);
  }, [updates.length]);

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Section header: What's New + View All ===== */}
        <div className="flex items-center justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <h2 className="font-serif text-[28px] sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-none">
              <span style={{ color: NAVY }}>What&apos;s </span>
              <span style={{ color: RED }}>New</span>
            </h2>
            <span className="block mt-2.5 h-[3px] w-16 sm:w-20 rounded-full" style={{ background: RED }} />
          </div>
          <Link
            href="/shop"
            className="group text-sm sm:text-[15px] font-bold inline-flex items-center gap-1.5 shrink-0"
            style={{ color: RED }}
          >
            View All
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ===== Two-column content ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-8">
          {/* ---------- Left: featured release carousel ---------- */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] xl:h-[620px] select-none">
            <div
              className="flex flex-col h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateY(-${active * 100}%)` }}
            >
              {slides.map((s) => (
                <div key={s.id} className="relative w-full h-full shrink-0 overflow-hidden">
                  {/* Warm backdrop */}
                  <div className="absolute inset-0" style={{ background: s.bg }} />
                  <div className="absolute -top-16 -left-10 w-64 h-64 rounded-full opacity-40 blur-3xl" style={{ background: "rgba(198,24,33,0.12)" }} />
                  <div className="absolute top-1/4 right-[28%] w-72 h-72 rounded-full opacity-50 blur-3xl" style={{ background: "rgba(255,255,255,0.55)" }} />

                  {/* Text block */}
                  <div className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-12 max-w-[62%] sm:max-w-[58%]">
                    <div>
                      <span
                        className="inline-flex items-center text-white text-[10px] sm:text-[11px] font-extrabold tracking-[0.14em] px-3 py-1.5 rounded-full shadow-sm"
                        style={{ background: RED }}
                      >
                        {s.badge}
                      </span>
                      <p className="mt-4 text-[13px] sm:text-sm font-semibold tracking-wide" style={{ color: "rgba(22,38,63,0.65)" }}>
                        {s.kicker}
                      </p>
                      <h3
                        className="mt-1.5 text-[26px] sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold leading-[1.15]"
                        style={{ color: NAVY, fontFamily: "var(--font-devanagari-display), var(--font-serif), serif" }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 text-[13px] sm:text-[15px] lg:text-base font-medium leading-snug" style={{ color: "rgba(56,42,24,0.78)" }}>
                        {s.subtitle}
                      </p>
                      <Link
                        href={s.href}
                        className="group/cta mt-5 sm:mt-6 inline-flex items-center gap-2 text-white text-[13px] sm:text-sm font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-[0_10px_22px_-8px_rgba(198,24,33,0.55)] transition-all hover:shadow-[0_14px_26px_-8px_rgba(198,24,33,0.65)] hover:-translate-y-0.5"
                        style={{ background: RED }}
                      >
                        {s.cta}
                        <span className="transition-transform group-hover/cta:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Book render on the right */}
                  <div className="absolute inset-y-0 right-0 w-[40%] sm:w-[38%] flex items-end justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.cover}
                      alt={s.title}
                      className="relative z-10 h-[62%] sm:h-[66%] lg:h-[72%] w-auto object-contain drop-shadow-[0_22px_26px_rgba(74,48,18,0.35)] -rotate-2"
                    />
                  </div>

                  {/* Wooden surface */}
                  <div
                    className="absolute bottom-0 inset-x-0 h-8 sm:h-10"
                    style={{
                      background: "linear-gradient(180deg, #9A6A3B 0%, #7A4E28 70%, #63401F 100%)",
                      borderTop: "1px solid rgba(255,255,255,0.25)",
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 h-1 opacity-30 blur-[2px] bg-black/30" />
                </div>
              ))}
            </div>

            {/* Prev / Next */}
            <button
              onClick={prev}
              aria-label="Previous featured release"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronUp className="w-5 h-5" style={{ color: NAVY }} />
            </button>
            <button
              onClick={next}
              aria-label="Next featured release"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronDown className="w-5 h-5" style={{ color: NAVY }} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    active === i ? "w-6 h-2.5" : "w-2.5 h-2.5 hover:scale-110"
                  }`}
                  style={{
                    background: active === i ? NAVY : "rgba(255,255,255,0.92)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ---------- Right: Latest Updates panel ---------- */}
          <aside className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col lg:h-full">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-serif text-[20px] sm:text-2xl font-bold tracking-tight leading-none" style={{ color: NAVY }}>
                  Latest Updates
                </h3>
                <span className="block mt-2 h-[3px] w-11 rounded-full" style={{ background: RED }} />
              </div>
              <Link
                href="/announcements"
                className="group text-[13px] font-bold inline-flex items-center gap-1 shrink-0"
                style={{ color: RED }}
              >
                View All
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <ul className="divide-y divide-gray-100 flex-1">
              {shown.map((u, i) => (
                <li
                  key={u.title}
                  className={
                    i === 0 && fadingOut
                      ? "row-feed-out"
                      : i === shown.length - 1
                        ? "row-feed-in"
                        : ""
                  }
                >
                  <Link href={u.href} className="group py-4 flex items-center gap-3.5 sm:gap-4 w-full">
                    <div className="shrink-0 w-[92px] h-[84px] sm:w-[104px] sm:h-[94px] rounded-[10px] overflow-hidden border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.image} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-[15px] sm:text-[17px] leading-snug line-clamp-2 transition-colors" style={{ color: NAVY }}>
                        {u.title}
                      </h4>
                      {u.desc && <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5 line-clamp-1 font-medium">{u.desc}</p>}
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-1 font-semibold">{u.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-[#C61821] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
