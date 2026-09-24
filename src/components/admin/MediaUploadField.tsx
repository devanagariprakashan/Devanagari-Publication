"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, FileText, Video, ExternalLink, CheckCircle2 } from "lucide-react";

const formats = { file: ["pdf"], video: ["mp4", "webm", "mov"] };

export default function MediaUploadField({
  name,
  label,
  kind,
  initialValue = "",
}: {
  name: string;
  label: string;
  kind: keyof typeof formats;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const Icon = kind === "file" ? FileText : Video;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="text-xs font-bold text-gray-700">
          {label}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Attached
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
          <input
            id={name}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-gray-900 transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            placeholder={
              kind === "video" ? "https://youtube.com/... or direct MP4 URL" : "https://... or PDF file link"
            }
          />
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-600"
              title="Open preview link in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{
            multiple: false,
            resourceType: "auto",
            clientAllowedFormats: formats[kind],
            sources: ["local", "url"],
          }}
          onSuccess={(result) => {
            if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
              setValue(String(result.info.secure_url));
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900 active:scale-95"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload {kind === "file" ? "PDF" : "Video"}
            </button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
}
