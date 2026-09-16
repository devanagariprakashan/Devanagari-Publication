"use client";

import { useState, useTransition } from "react";
import { saveHeroBanner } from "@/actions/page-content";
import { HERO_BANNER_DEFAULT } from "@/data/heroContent";
import ImageUploadField from "./ImageUploadField";
import { btnPrimary, btnSecondary, card } from "./ui";

const PHONE_W = 390;
const PHONE_H = 660;
const PHONE_FRAME = 230;
const phoneK = PHONE_FRAME / PHONE_W;
const DESK_W = 1280;
const DESK_H = 780;
const DESK_FRAME = 640;
const deskK = DESK_FRAME / DESK_W;

export default function HeroBannerForm({ initial }: { initial: string }) {
  const [bannerImage, setBannerImage] = useState(initial);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      try {
        const result = await saveHeroBanner(bannerImage);
        setMessage(result);
      } catch {
        setMessage({ error: "Changes could not be saved. Please try again." });
      }
    });
  }

  return <form className="space-y-6" onSubmit={event => {
    event.preventDefault();
    save();
  }}>
    <fieldset disabled={pending} className="space-y-6">
      <div className={card + " space-y-4 p-6"}>
        <ImageUploadField id="bannerImage" label="Banner image" value={bannerImage} onChange={value => { setBannerImage(value); setMessage({}); }} />
        <p className="text-sm text-gray-500">Recommended 2000 × 1000 px (2:1 landscape), minimum 1600 × 800 px. JPG, PNG or WebP. The banner is used as a full-bleed background: phones crop the left/right, so keep the main subject centred.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setBannerImage(HERO_BANNER_DEFAULT); setMessage({}); }} className={btnSecondary}>Use default banner</button>
          <button type="submit" className={btnPrimary}>{pending ? "Saving..." : "Save changes"}</button>
        </div>
        {message.error && <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message.error}</div>}
        {message.success && <div role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message.success}</div>}
      </div>

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Live preview</h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Phone</p>
            <div style={{ width: PHONE_FRAME, height: PHONE_H * phoneK }} className="overflow-hidden rounded-lg border border-gray-300">
              <iframe title="Phone preview" src={`/admin/hero-preview?image=${encodeURIComponent(bannerImage)}`} width={PHONE_W} height={PHONE_H} style={{ transform: `scale(${phoneK})`, transformOrigin: "top left" }} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Desktop</p>
            <div style={{ width: DESK_FRAME, height: DESK_H * deskK }} className="overflow-hidden rounded-lg border border-gray-300">
              <iframe title="Desktop preview" src={`/admin/hero-preview?image=${encodeURIComponent(bannerImage)}`} width={DESK_W} height={DESK_H} style={{ transform: `scale(${deskK})`, transformOrigin: "top left" }} />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  </form>;
}
