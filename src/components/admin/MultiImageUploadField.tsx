"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function MultiImageUploadField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (update: (previous: string[]) => string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">{label}</label>
        <span className="text-[10px] font-semibold text-gray-400">
          {values.length} {values.length === 1 ? "page" : "pages"} added
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {values.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-24 w-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition-all hover:scale-105 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery page ${index + 1}`} className="h-full w-full object-cover" />

            {/* Index badge */}
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.2 text-[8px] font-bold text-white">
              #{index + 1}
            </span>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onChange((previous) => previous.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600/90 text-white opacity-0 shadow-xs transition group-hover:opacity-100 hover:bg-red-700"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Upload Button Tile */}
        <CldUploadWidget
          options={{
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            multiple: true,
            resourceType: "image",
            clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif", "avif"],
            sources: ["local", "url"],
          }}
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(results) => {
            const info = results.info;
            const url = Array.isArray(info)
              ? info[0]?.secure_url
              : (info as { secure_url?: string })?.secure_url;
            if (url) onChange((previous) => [...previous, url]);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex h-24 w-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-500 transition-all hover:border-brand-400 hover:bg-red-50/20 hover:text-brand-700 active:scale-95"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs">
                <Upload className="h-3.5 w-3.5 text-gray-600" />
              </div>
              <span className="text-[10px] font-bold">+ Add Page</span>
            </button>
          )}
        </CldUploadWidget>
      </div>
      <p className="text-[11px] text-gray-500">
        These extra photos appear in the student preview gallery alongside the cover image.
      </p>
    </div>
  );
}
