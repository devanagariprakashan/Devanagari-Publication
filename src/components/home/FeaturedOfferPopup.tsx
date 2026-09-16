"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  Percent,
  BookOpen,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { FEATURED_OFFER } from "@/data/featuredOffer";
import { useFeaturedCoupon } from "@/components/providers/FeaturedCouponProvider";
import { couponDiscountLabel, couponHeadline } from "@/lib/coupon-shared";

const BADGES = [
  { icon: BookOpen, text: "Exam-Focused Content" },
  { icon: ShieldCheck, text: "Trusted by Aspirants" },
  { icon: Truck, text: "Pan India Delivery" },
  { icon: Star, text: "Latest Editions" },
];

const CHIPS = ["UPSC", "MPPSC", "Judiciary", "SI", "Competitive Exams"];

export default function FeaturedOfferPopup() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const coupon = useFeaturedCoupon();

  const code = coupon?.code ?? FEATURED_OFFER.code;
  const discount = coupon ? couponDiscountLabel(coupon) : FEATURED_OFFER.discount;
  const title = coupon ? couponHeadline(coupon) : FEATURED_OFFER.title;
  const [titleBefore, titleAfter] = title.split(discount);
  const highlightsDiscount = titleAfter !== undefined;

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus();
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const close = () => {
    setShown(false);
    setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={FEATURED_OFFER.label}
        className={`relative flex max-h-[92vh] w-[min(960px,94vw)] flex-col overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 md:min-h-[600px] ${
          shown ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
      >
        {/* Banner is the popup background at every size, like the hero section. Mobile position favours the book stack. */}
        <div className="absolute inset-0 bg-[url('/popup-banner.png')] bg-cover bg-[position:70%_center] md:bg-center" />
        {/* Mobile: wash, clear at the very top (artwork shows behind the logo) and near-solid below where the copy sits. Desktop: left-to-right scrim. */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/90 to-white/95 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/85 to-transparent md:block" />

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close promotional popup"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md ring-1 ring-black/5 transition hover:bg-white hover:text-[#C61821] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C61821] md:right-4 md:top-4 md:h-11 md:w-11"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="relative z-10 flex flex-1 flex-col gap-3.5 p-4 sm:gap-5 sm:p-6 md:w-[54%] md:gap-6 md:p-8">
          <img
            src="/logos.png"
            alt="Devanagari Publications"
            className="h-12 w-auto self-start object-contain sm:h-14 md:h-16"
          />

          <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-rose-50 via-red-50/70 to-white/80 p-5 shadow-sm sm:p-6">
            <Percent
              className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-[#C61821] opacity-[0.08]"
              strokeWidth={1.5}
            />
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C61821]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C61821]" />
                {FEATURED_OFFER.label}
              </div>

              <h2 className="font-serif text-[26px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-3xl md:text-[34px]">
                {highlightsDiscount ? (
                  <>
                    {titleBefore}
                    <span className="text-[#C61821]">{discount}</span>
                    {titleAfter}
                  </>
                ) : (
                  title
                )}
              </h2>

              <p className="mt-2.5 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                <span>Use code</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(code)}
                  title="Click to copy coupon code"
                  className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-xs font-bold text-gray-800 transition hover:border-[#C61821]"
                >
                  {code}
                </button>
                <span>at checkout.</span>
              </p>

              <Link
                href={FEATURED_OFFER.ctaHref}
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-[#C61821] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#A81119] active:scale-95"
              >
                <span>{FEATURED_OFFER.ctaLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#C61821] sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-gray-700 sm:text-sm md:text-[15px]">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-red-100 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-[#A81119] sm:px-4 sm:text-sm md:px-5 md:py-2 md:text-[15px]"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Invest in knowledge. It pays forever.
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
