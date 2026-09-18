"use client";

import { useState, useTransition } from "react";
import { saveHeroBanner } from "@/actions/page-content";
import { HERO_BANNER_DEFAULT, HERO_TEXT_DEFAULTS } from "@/data/heroContent";
import ImageUploadField from "./ImageUploadField";
import { btnPrimary, btnSecondary, card, inputCls, labelCls } from "./ui";

const PHONE_W = 390;
const PHONE_H = 660;
const PHONE_FRAME = 230;
const phoneK = PHONE_FRAME / PHONE_W;
const DESK_W = 1280;
const DESK_H = 780;
const DESK_FRAME = 640;
const deskK = DESK_FRAME / DESK_W;

type HeroSettings = {
  bannerImage: string;
  badgeText: string;
  editionBadge: string;
  headingLine1: string;
  headingHighlight: string;
  headingLine3: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

const TEXT_FIELDS: { key: keyof Omit<HeroSettings, "bannerImage">; label: string; multiline?: boolean }[] = [
  { key: "badgeText", label: "Trust badge text" },
  { key: "editionBadge", label: "Edition tag" },
  { key: "headingLine1", label: "Heading, line 1" },
  { key: "headingHighlight", label: "Heading, highlighted word" },
  { key: "headingLine3", label: "Heading, line 3" },
  { key: "description", label: "Description", multiline: true },
  { key: "ctaPrimaryLabel", label: "Primary button text" },
  { key: "ctaSecondaryLabel", label: "Secondary button text" },
];

export default function HeroBannerForm({ initial }: { initial: HeroSettings }) {
  const [settings, setSettings] = useState(initial);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [pending, startTransition] = useTransition();

  function update(key: keyof HeroSettings, value: string) {
    setSettings(previous => ({ ...previous, [key]: value }));
    setMessage({});
  }

  function save() {
    startTransition(async () => {
      try {
        const result = await saveHeroBanner(settings);
        setMessage(result);
      } catch {
        setMessage({ error: "Changes could not be saved. Please try again." });
      }
    });
  }

  const previewParams = new URLSearchParams({
    image: settings.bannerImage,
    badgeText: settings.badgeText,
    editionBadge: settings.editionBadge,
    headingLine1: settings.headingLine1,
    headingHighlight: settings.headingHighlight,
    headingLine3: settings.headingLine3,
    description: settings.description,
    ctaPrimaryLabel: settings.ctaPrimaryLabel,
    ctaSecondaryLabel: settings.ctaSecondaryLabel,
  }).toString();

  return <form className="space-y-6" onSubmit={event => {
    event.preventDefault();
    save();
  }}>
    <fieldset disabled={pending} className="space-y-6">
      <div className={card + " space-y-4 p-6"}>
        <ImageUploadField id="bannerImage" label="Banner image" value={settings.bannerImage} onChange={value => update("bannerImage", value)} />
        <p className="text-sm text-gray-500">Recommended 2000 × 1000 px (2:1 landscape), minimum 1600 × 800 px. JPG, PNG or WebP. The banner is used as a full-bleed background: phones crop the left/right, so keep the main subject centred.</p>
        <button type="button" onClick={() => update("bannerImage", HERO_BANNER_DEFAULT)} className={btnSecondary}>Use default banner</button>
      </div>

      <div className={card + " space-y-4 p-6"}>
        <h2 className="text-lg font-semibold text-gray-900">Banner text</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TEXT_FIELDS.map(({ key, label, multiline }) => <div key={key} className={multiline ? "md:col-span-2" : ""}>
            <label className={labelCls} htmlFor={key}>{label}</label>
            {multiline
              ? <textarea id={key} className={inputCls + " mt-1"} rows={3} value={settings[key]} onChange={event => update(key, event.target.value)} />
              : <input id={key} className={inputCls + " mt-1"} type="text" value={settings[key]} onChange={event => update(key, event.target.value)} />}
          </div>)}
        </div>
        <button type="button" onClick={() => setSettings(previous => ({ ...previous, ...HERO_TEXT_DEFAULTS }))} className={btnSecondary}>Reset text to default</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={btnPrimary}>{pending ? "Saving..." : "Save changes"}</button>
      </div>
      {message.error && <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message.error}</div>}
      {message.success && <div role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message.success}</div>}

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Live preview</h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Phone</p>
            <div style={{ width: PHONE_FRAME, height: PHONE_H * phoneK }} className="overflow-hidden rounded-lg border border-gray-300">
              <iframe title="Phone preview" src={`/admin/hero-preview?${previewParams}`} width={PHONE_W} height={PHONE_H} style={{ transform: `scale(${phoneK})`, transformOrigin: "top left" }} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Desktop</p>
            <div style={{ width: DESK_FRAME, height: DESK_H * deskK }} className="overflow-hidden rounded-lg border border-gray-300">
              <iframe title="Desktop preview" src={`/admin/hero-preview?${previewParams}`} width={DESK_W} height={DESK_H} style={{ transform: `scale(${deskK})`, transformOrigin: "top left" }} />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  </form>;
}
