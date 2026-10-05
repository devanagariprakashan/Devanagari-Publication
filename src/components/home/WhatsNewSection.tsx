"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import type { WhatsNewSlideRow, WhatsNewUpdateRow } from "@/components/admin/WhatsNewForms";

const NAVY = "#16263F";
const RED = "#C61821";

// Warm backdrop gradients, cycled by slide position. The slides and updates themselves come from the admin panel.
const SLIDE_BGS = [
  "linear-gradient(120deg, #F9EDDC 0%, #F3DFC4 55%, #EAD3AF 100%)",
  "linear-gradient(120deg, #F8ECD8 0%, #F0D8B4 55%, #E3C498 100%)",
  "linear-gradient(120deg, #FAEFDE 0%, #F2DFC0 55%, #E8CEA6 100%)",
  "linear-gradient(120deg, #F6EADC 0%, #EED8B9 55%, #DFC093 100%)",
];

// ponytail: feed rotates one row at a time (30s), circular window over the pool.
const SLIDE_STEP_MS = 3_000;
const FEED_STEP_MS = 30_000;
const FEED_FADE_MS = 650;
const FEED_SIZE = 4;

type SlideView = {
  id: string;
  badge: string;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  cover: string;
  bg: string;
};
type UpdateView = { id: string; title: string; desc?: string; date: string; image: string; href: string };

export default function WhatsNewSection({
  slideRows,
  updateRows,
}: {
  slideRows: WhatsNewSlideRow[];
  updateRows: WhatsNewUpdateRow[];
}) {
  const slides: SlideView[] = useMemo(
    () =>
      slideRows.map((row, i) => ({
        id: row.id,
        badge: row.badge ?? "NEW RELEASE",
        kicker: row.kicker ?? "",
        title: row.title,
        subtitle: row.subtitle ?? "",
        cta: row.cta ?? "पुस्तक देखें",
        href: row.href ?? "/shop",
        cover: row.cover ?? "/images/books/image-2.png",
        bg: SLIDE_BGS[i % SLIDE_BGS.length],
      })),
    [slideRows],
  );
  const updates: UpdateView[] = useMemo(
    () =>
      updateRows.map((row) => ({
        id: row.id,
        title: row.title,
        desc: row.note ?? undefined,
        date: row.date_text ?? "",
        image: row.image ?? "/images/books/image-2.png",
        href: row.href ?? "/shop",
      })),
    [updateRows],
  );
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [feedStart, setFeedStart] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const prev = () => setActive((a) => (a === 0 ? slides.length - 1 : a - 1));
  const next = () => setActive((a) => (a === slides.length - 1 ? 0 : a + 1));

  useEffect(() => {
    if (slides.length < 2 || hovered || focused) return;
    const timer = setTimeout(() => setActive(index => (index + 1) % slides.length), SLIDE_STEP_MS);
    return () => clearTimeout(timer);
  }, [active, slides.length, hovered, focused]);

  const start = updates.length ? ((feedStart % updates.length) + updates.length) % updates.length : 0;
  const feedSize = Math.min(FEED_SIZE, updates.length);
  const shown = Array.from({ length: feedSize }, (_, k) => updates[(start + k) % updates.length]);

  useEffect(() => {
    if (updates.length < 2) return;
    const t = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setFeedStart((s) => (s + 1) % updates.length);
        setFadingOut(false);
      }, FEED_FADE_MS);
    }, FEED_STEP_MS);
    return () => clearInterval(t);
  }, [updates.length]);

  if (slides.length === 0 && updates.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 bg-white">
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
        <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${slides.length > 0 && updates.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_440px]" : ""}`}>
          {/* ---------- Left: featured release carousel ---------- */}
          {slides.length > 0 && (
          <div
            role="region"
            aria-label="Featured releases"
            aria-roledescription="carousel"
            data-active-slide={active}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
            className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[420px] xl:h-[460px] select-none">
            <div
              className="flex flex-col h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateY(-${active * 100}%)` }}
            >
              {slides.map((s, index) => (
                <div aria-hidden={active !== index} key={s.id} className="relative w-full h-full shrink-0 overflow-hidden">
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
                        tabIndex={active === index ? 0 : -1}
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
                  aria-current={active === i ? "true" : undefined}
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

          )}

          {/* ---------- Right: Latest Updates panel ---------- */}
          {updates.length > 0 && (
          <aside className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col lg:h-full">
            <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
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
                  key={u.id}
                  className={
                    i === 0 && fadingOut
                      ? "row-feed-out"
                      : i === shown.length - 1
                        ? "row-feed-in"
                        : ""
                  }
                >
                  <Link href={u.href} className="group py-2.5 sm:py-3 flex items-center gap-3 sm:gap-3.5 w-full">
                    <div className="shrink-0 w-[64px] h-[56px] sm:w-[72px] sm:h-[64px] rounded-[10px] overflow-hidden border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.image} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-[14px] sm:text-[16px] leading-snug line-clamp-2 transition-colors" style={{ color: NAVY }}>
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
          )}
        </div>
      </div>
    </section>
  );
}
