"use client";

import { useEffect, useRef, useState, useTransition, type ComponentType, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Eye, ImageIcon, ImageOff, Loader2, Lock, Monitor, RotateCcw, Save, Smartphone, Trash2, Type } from "lucide-react";
import { saveHeroBanner } from "@/actions/page-content";
import { HERO_TEXT_DEFAULTS } from "@/data/heroContent";
import ImageUploadField from "./ImageUploadField";
import { Pill } from "./PageHeader";
import { btnPrimary, btnSecondary, card, inputCls, labelCls } from "./ui";

const PHONE_W = 390;
const PHONE_H = 693; // 390 × 16/9, the 9:16 mobile banner
const PHONE_FRAME = 250;
const phoneK = PHONE_FRAME / PHONE_W;
const DESK_W = 1536; // 1920 px laptop screen at 125% scaling; wide enough (> 1520) to show the 2:1 banner full-width like the live site
const DESK_H = 760; // matches the storefront hero's lg:min-h-[760px]

type HeroSettings = {
  bannerImage: string;
  mobileBannerImage: string;
  badgeText: string;
  editionBadge: string;
  headingLine1: string;
  headingHighlight: string;
  headingLine3: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

type TextKey = keyof Omit<HeroSettings, "bannerImage" | "mobileBannerImage">;
type TextField = { key: TextKey; label: string; hint?: string; multiline?: boolean };

const TEXT_GROUPS: { title: string; cols: string; fields: TextField[] }[] = [
  { title: "Badge", cols: "md:grid-cols-2", fields: [
    { key: "badgeText", label: "Trust badge text", hint: "Pill above the heading" },
    { key: "editionBadge", label: "Edition tag", hint: "Hidden on phones" },
  ] },
  { title: "Heading", cols: "md:grid-cols-3", fields: [
    { key: "headingLine1", label: "Line 1" },
    { key: "headingHighlight", label: "Highlighted word", hint: "Brand red" },
    { key: "headingLine3", label: "Line 3" },
  ] },
  { title: "Description", cols: "", fields: [{ key: "description", label: "Description", multiline: true }] },
  { title: "Buttons", cols: "md:grid-cols-2", fields: [
    { key: "ctaPrimaryLabel", label: "Primary button text" },
    { key: "ctaSecondaryLabel", label: "Secondary button text" },
  ] },
];

type PreviewView = "both" | "phone" | "desktop";
const VIEWS: { id: PreviewView; label: string }[] = [
  { id: "both", label: "Both" },
  { id: "phone", label: "Phone" },
  { id: "desktop", label: "Desktop" },
];

function SectionHeader({ icon: Icon, title, description, action }: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/30"><Icon className="h-5 w-5" /></span>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {action}
  </div>;
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">{children}</span>;
}

/** Thumbnail that shows the image at its real aspect ratio, with a placeholder when empty or broken. */
function BannerThumb({ src, className }: { src: string; className: string }) {
  const [broken, setBroken] = useState(false);
  const showImage = src && !broken;
  return <div className={`relative shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 ${className}`}>
    {showImage
      // eslint-disable-next-line @next/next/no-img-element
      ? <img key={src} src={src} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
      : <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-rose-50/60 text-gray-400">
        <ImageOff className="h-6 w-6" />
        <span className="text-xs">{src ? "Can't load image" : "No image"}</span>
      </div>}
  </div>;
}

function Tips({ items }: { items: string[] }) {
  return <ul className="space-y-1.5 text-sm text-gray-500">
    {items.map(item => <li key={item} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400" />{item}</li>)}
  </ul>;
}

/** Width of an element in px, kept in sync with its size. */
function useElementWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth || fallback));
    observer.observe(element);
    return () => observer.disconnect();
  }, [fallback]);
  return [ref, width] as const;
}

export default function HeroBannerForm({ initial }: { initial: HeroSettings }) {
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [pending, startTransition] = useTransition();
  const [deskRef, deskWidth] = useElementWidth<HTMLDivElement>(640);
  const [view, setView] = useState<PreviewView>("both");

  const dirty = (Object.keys(settings) as (keyof HeroSettings)[]).some(key => settings[key] !== saved[key]);
  const deskK = Math.min(deskWidth / DESK_W, 1);

  function update(key: keyof HeroSettings, value: string) {
    setSettings(previous => ({ ...previous, [key]: value }));
    setMessage({});
  }

  function save() {
    const snapshot = settings;
    startTransition(async () => {
      try {
        const result = await saveHeroBanner(snapshot);
        setMessage(result);
        if (result.success) setSaved(snapshot);
      } catch {
        setMessage({ error: "Changes could not be saved. Please try again." });
      }
    });
  }

  const previewParams = new URLSearchParams({
    image: settings.bannerImage,
    mobileImage: settings.mobileBannerImage,
    badgeText: settings.badgeText,
    editionBadge: settings.editionBadge,
    headingLine1: settings.headingLine1,
    headingHighlight: settings.headingHighlight,
    headingLine3: settings.headingLine3,
    description: settings.description,
    ctaPrimaryLabel: settings.ctaPrimaryLabel,
    ctaSecondaryLabel: settings.ctaSecondaryLabel,
  }).toString();

  const panel = "space-y-3 rounded-xl bg-gray-50/70 p-4 ring-1 ring-gray-100 sm:p-5";

  return <form className="space-y-6" onSubmit={event => {
    event.preventDefault();
    save();
  }}>
    <fieldset disabled={pending} className="space-y-6">
      <section className={card + " p-6"}>
        <SectionHeader icon={ImageIcon} title="Banner images" description="Upload a separate image for desktop and for phones & tablets, or paste a URL." />
        <div className="space-y-5">
          <div className="flex flex-col gap-5 rounded-xl bg-gray-50/70 p-4 ring-1 ring-gray-100 sm:flex-row sm:p-5">
            <BannerThumb src={settings.bannerImage} className="aspect-[2/1] w-full self-start sm:w-80" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100"><Monitor className="h-4 w-4" /></span>
                <h3 className="text-sm font-semibold text-gray-900">Desktop banner</h3>
                <Chip>2:1 landscape</Chip>
                <Chip>2000 × 1000 px</Chip>
              </div>
              <ImageUploadField id="bannerImage" label="Image" value={settings.bannerImage} onChange={value => update("bannerImage", value)} />
              <Tips items={[
                "Keep the left ~45% free of important artwork: the heading, text and buttons sit there. Put the books and main subject on the right.",
                "Phones and tablets use this image too if no mobile banner is set.",
              ]} />
            </div>
          </div>

          <div className={"flex flex-col gap-5 sm:flex-row " + panel}>
            <BannerThumb src={settings.mobileBannerImage} className="aspect-[9/16] w-36 self-start rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100"><Smartphone className="h-4 w-4" /></span>
                <h3 className="text-sm font-semibold text-gray-900">Mobile banner</h3>
                <Chip>9:16 portrait</Chip>
                <Chip>1080 × 1920 px</Chip>
                {settings.mobileBannerImage
                  ? <Pill tone="green">Active on phones &amp; tablets</Pill>
                  : <Pill tone="amber">Not set: phones &amp; tablets use the desktop banner</Pill>}
              </div>
              <ImageUploadField id="mobileBannerImage" label="Image" value={settings.mobileBannerImage} onChange={value => update("mobileBannerImage", value)} />
              <Tips items={[
                "Keep the top ~40% free of important artwork: the badge, heading, text and buttons sit there.",
                "Stats are hidden below 1024 px when a mobile banner is set.",
              ]} />
              <button type="button" onClick={() => update("mobileBannerImage", "")} disabled={!settings.mobileBannerImage} className={btnSecondary + " gap-2"}><Trash2 className="h-4 w-4" />Remove mobile banner</button>
            </div>
          </div>
        </div>
      </section>

      <section className={card + " p-6"}>
        <SectionHeader
          icon={Type}
          title="Banner text"
          description="The copy shown over the banner. Changes appear in the live preview below."
          action={<button type="button" onClick={() => setSettings(previous => ({ ...previous, ...HERO_TEXT_DEFAULTS }))} className={btnSecondary + " gap-2"}><RotateCcw className="h-4 w-4" />Reset text</button>}
        />
        <div className="space-y-6">
          {TEXT_GROUPS.map(group => <div key={group.title}>
            <h3 className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {group.title}<span className="h-px flex-1 bg-gray-100" />
            </h3>
            <div className={`grid grid-cols-1 gap-x-5 gap-y-4 ${group.cols}`}>
              {group.fields.map(({ key, label, hint, multiline }) => <div key={key}>
                <div className="flex items-baseline justify-between gap-2">
                  <label className={labelCls} htmlFor={key}>{label}</label>
                  {hint && <span className="text-xs text-gray-400">{hint}</span>}
                  {multiline && <span className="text-xs tabular-nums text-gray-400">{settings[key].length} characters</span>}
                </div>
                {multiline
                  ? <textarea id={key} className={inputCls + " mt-1"} rows={3} value={settings[key]} onChange={event => update(key, event.target.value)} />
                  : <input id={key} className={inputCls + " mt-1"} type="text" value={settings[key]} onChange={event => update(key, event.target.value)} />}
              </div>)}
            </div>
          </div>)}
        </div>
      </section>

      <section className={card + " p-6"}>
        <SectionHeader
          icon={Eye}
          title="Live preview"
          description="Exactly how the homepage hero looks on a phone (390 px) and a laptop (1536 px)."
          action={<div role="group" aria-label="Preview device" className="inline-flex rounded-lg bg-gray-100 p-1">
            {VIEWS.map(({ id, label }) => <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition ${view === id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >{label}</button>)}
          </div>}
        />
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-gray-50 p-6 ring-1 ring-rose-100/70 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-rose-50 blur-3xl" />
          <div className={`relative grid items-start gap-x-10 gap-y-8 ${view === "both" ? "lg:grid-cols-[auto_minmax(0,1fr)]" : ""}`}>
            <div className={`mx-auto lg:mx-0 ${view === "desktop" ? "hidden" : ""} ${view === "phone" ? "lg:mx-auto" : ""}`}>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700"><Smartphone className="h-4 w-4 text-rose-500" />Phone</p>
              <div className="relative rounded-[34px] bg-white p-2.5 shadow-xl shadow-gray-900/10 ring-1 ring-gray-300">
                <div className="absolute left-1/2 top-4 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-gray-300" />
                <div style={{ width: PHONE_FRAME, height: PHONE_H * phoneK }} className="overflow-hidden rounded-[26px] bg-white">
                  <iframe title="Phone preview" src={`/admin/hero-preview?${previewParams}`} width={PHONE_W} height={PHONE_H} style={{ transform: `scale(${phoneK})`, transformOrigin: "top left" }} />
                </div>
              </div>
            </div>
            {/* Kept mounted (only hidden) so the width observer keeps working when switching views. */}
            <div className={`min-w-0 ${view === "phone" ? "hidden" : ""}`}>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700"><Monitor className="h-4 w-4 text-rose-500" />Desktop</p>
              <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-gray-900/10 ring-1 ring-gray-300">
                <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-3 flex h-5 flex-1 items-center gap-1.5 rounded-md bg-white px-2 text-[10px] text-gray-400"><Lock className="h-2.5 w-2.5" />Homepage</span>
                </div>
                <div ref={deskRef} style={{ height: DESK_H * deskK }} className="w-full overflow-hidden">
                  <iframe title="Desktop preview" src={`/admin/hero-preview?${previewParams}`} width={DESK_W} height={DESK_H} style={{ transform: `scale(${deskK})`, transformOrigin: "top left" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-gray-200 backdrop-blur">
        <div className="min-w-0 text-sm">
          {message.error
            ? <p role="alert" className="flex items-center gap-2 font-medium text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{message.error}</p>
            : message.success && !dirty
              ? <p role="status" className="flex items-center gap-2 font-medium text-green-700"><CheckCircle2 className="h-4 w-4 shrink-0" />{message.success}. Live on the homepage.</p>
              : dirty
                ? <p className="flex items-center gap-2 font-medium text-amber-700"><span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />Unsaved changes</p>
                : <p className="text-gray-500">All changes saved</p>}
        </div>
        <button type="submit" disabled={!dirty} className={btnPrimary + " gap-2"}>
          {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save changes</>}
        </button>
      </div>
    </fieldset>
  </form>;
}
