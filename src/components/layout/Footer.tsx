"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  BookOpen,
  Award,
  ArrowUp,
  Send,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Check,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [site, setSite] = useState<SiteSettings>(SITE_DEFAULTS);

  // ponytail: client fetch like TopBanner, no context/store until >2 consumers need sync
  useEffect(() => {
    let cancelled = false;
    createClient().from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (!cancelled && data) setSite({ ...SITE_DEFAULTS, ...data });
    });
    return () => { cancelled = true; };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 3000);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#0B0F17] text-gray-300 overflow-hidden border-t border-gray-800 selection:bg-[#C61821] selection:text-white">
      {/* Background Subtle Gradient & Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(198,24,33,0.18),rgba(11,15,23,0))] pointer-events-none"
        aria-hidden="true"
      />

      {/* ============================================================ */}
      {/* TOP VALUE PROPOSITION BAR / TRUST BADGES */}
      {/* ============================================================ */}
      <div className="border-b border-gray-800/80 bg-[#0E131F]/90 backdrop-blur-sm relative z-10">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-[#EF4444] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#C61821] group-hover:text-white transition-all duration-300 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  Free Delivery
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                  On all orders above ₹499
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-[#EF4444] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#C61821] group-hover:text-white transition-all duration-300 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  100% Genuine
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                  Authentic &amp; updated syllabus
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-[#EF4444] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#C61821] group-hover:text-white transition-all duration-300 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  Secure Checkout
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                  UPI, Cards &amp; NetBanking
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-[#EF4444] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#C61821] group-hover:text-white transition-all duration-300 shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  Expert Support
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                  Aspirant counseling &amp; guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN FOOTER CONTENT */}
      {/* ============================================================ */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* -------------------------------------------------------- */}
          {/* COL 1: BRAND BIO & CONTACT (LG: 4 COLS) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">
            {/* Brand Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-[#C61821] flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-200">
                <span className="font-devanagariDisplay text-2xl font-bold leading-none">
                  दे
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white tracking-tight leading-tight">
                  Devanagari
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-red-400 uppercase leading-none">
                  Books &amp; Publications
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed max-w-sm">
              India&apos;s premier publication house delivering authentic, syllabus-aligned books and study material for MPPSC, Civil Judge, Judiciary, and competitive civil service examinations.
            </p>

            {/* Contact Details List */}
            <div className="space-y-3 pt-2 text-xs sm:text-[13px]">
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {site.address}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-[#EF4444] shrink-0" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {site.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-[#EF4444] shrink-0" />
                <a
                  href={`tel:+${site.phones.replace(/\D/g, "").slice(-12) || "919876543210"}`}
                  className="hover:text-white transition-colors"
                >
                  {site.phones}
                </a>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                {/* Telegram */}
                <a
                  href={site.telegram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram Channel"
                  className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-[#229ED9] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={site.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube Channel"
                  className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={site.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp Support"
                  className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.108.549 4.168 1.595 5.973L.005 24l6.195-1.624a11.937 11.937 0 0 0 5.831 1.517l.005.001c6.635 0 12.001-5.367 12.001-11.991C24.037 5.367 18.667 0 12.031 0zm.005 21.942a9.927 9.927 0 0 1-5.064-1.39l-.363-.216-3.766.987 1.005-3.67-.236-.375a9.926 9.926 0 0 1-1.526-5.291c0-5.485 4.464-9.949 9.953-9.949 2.656 0 5.155 1.035 7.034 2.915a9.907 9.907 0 0 1 2.912 7.038c-.004 5.485-4.467 9.951-9.945 9.951zm5.449-7.464c-.299-.149-1.77-1.025-2.045-1.149-.275-.124-.475-.186-.675.149-.199.336-.773 1.149-.948 1.385-.175.236-.349.261-.648.112-.299-.149-1.263-.466-2.406-1.485-.89-.794-1.491-1.775-1.666-2.074-.175-.299-.019-.46.13-.609.135-.134.299-.349.449-.524.15-.174.199-.299.299-.498.1-.199.05-.374-.025-.524-.075-.149-.675-1.627-.925-2.228-.243-.585-.49-.506-.674-.515-.175-.009-.374-.01-.574-.01-.199 0-.524.075-.798.374-.274.299-1.048 1.025-1.048 2.5 0 1.474 1.073 2.898 1.223 3.098.15.199 2.112 3.226 5.117 4.526.715.31 1.273.495 1.708.633.719.228 1.373.196 1.891.119.578-.087 1.77-.723 2.02-1.422.25-.698.25-1.297.175-1.422-.075-.125-.274-.199-.573-.349z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={site.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Profile"
                  className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COL 2: EXAM CATEGORIES (LG: 2.5 COLS) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#C61821] rounded-full" />
              <span>Exam Categories</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-400">
              <li>
                <Link
                  href="/shop?search=MPPSC"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>MPPSC Prelims &amp; Mains</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?search=Civil+Judge"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Civil Judge &amp; Judiciary</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?search=Law"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>BNS, BNSS &amp; BSA Law</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?search=Hindi"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Hindi Grammar &amp; Sahitya</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?search=Nibandh"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Essay &amp; Draft Writing (Nibandh)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?search=General+Studies"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>General Studies Handbooks</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COL 3: QUICK LINKS (LG: 2.5 COLS) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#C61821] rounded-full" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-400">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>All Books Catalog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#authors"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Our Esteemed Authors</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Articles &amp; Exam Tips</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Publication Team</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Contact &amp; Wholesale Inquiries</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/account?tab=orders"
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500/70" />
                  <span>Track Your Order</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COL 4: NEWSLETTER & EXAM ALERTS (LG: 3.5 COLS) */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#C61821] rounded-full" />
              <span>Stay Exam Ready</span>
            </h4>
            <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed">
              Get the latest exam notifications, new book releases, and exclusive student discounts delivered to your inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] transition-all pr-12"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#C61821] hover:bg-[#A81119] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Instant Success Alert */}
              {isSubscribed && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Thank you! You have successfully subscribed to exam alerts.</span>
                </div>
              )}
            </form>

            {/* Guaranteed Trust & Payment Badges */}
            <div className="pt-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                100% Safe &amp; Verified Payments
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {["UPI", "RuPay", "VISA", "Mastercard", "NetBanking"].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-white/[0.05] border border-white/10 text-gray-300 tracking-wider"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM COPYRIGHT STRIP WITH BACK TO TOP BUTTON */}
        {/* Note: pb-24 on mobile ensures MobileBottomNav never overlaps! */}
        {/* ============================================================ */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 pb-24 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Devanagari Books &amp; Publications Pvt. Ltd. All rights reserved.</p>
            <span className="hidden sm:inline text-gray-600">•</span>
            <p className="text-gray-400">
              Empowering Civil Service Aspirants Across India
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors text-xs">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors text-xs">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-red-600 text-gray-300 hover:text-white border border-white/10 hover:border-red-500 transition-all duration-200 cursor-pointer text-xs font-semibold group"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
