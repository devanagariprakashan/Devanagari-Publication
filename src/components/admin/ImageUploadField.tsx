"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { btnSecondary, inputCls, labelCls } from "./ui";

export default function ImageUploadField({ id, label, value, onChange }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return <div>
    <label htmlFor={id} className={labelCls}>{label}</label>
    <div className="mt-1 flex flex-col gap-2 sm:flex-row">
      <input id={id} value={value} onChange={event => onChange(event.target.value)} className={inputCls + " min-w-0"} placeholder="https://res.cloudinary.com/..." />
      <CldUploadWidget signatureEndpoint="/api/cloudinary/sign" options={{ multiple: false, resourceType: "image", clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif", "avif"], sources: ["local", "url"] }} onSuccess={result => {
        const info = result.info;
        if (info && typeof info === "object" && "secure_url" in info) onChange(String(info.secure_url));
      }}>
        {({ open }) => <button type="button" onClick={() => open()} className={btnSecondary + " shrink-0 gap-2"}><Upload className="h-4 w-4" />Upload image</button>}
      </CldUploadWidget>
    </div>
  </div>;
}
