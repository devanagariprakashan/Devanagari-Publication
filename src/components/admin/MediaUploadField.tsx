"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { btnSecondary, inputCls, labelCls } from "./ui";

const formats = { file: ["pdf"], video: ["mp4", "webm", "mov"] };

export default function MediaUploadField({ name, label, kind, initialValue = "" }: {
  name: string;
  label: string;
  kind: keyof typeof formats;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  return <div>
    <label htmlFor={name} className={labelCls}>{label}</label>
    <div className="mt-1 flex flex-col gap-2 sm:flex-row">
      <input id={name} name={name} value={value} onChange={event => setValue(event.target.value)} className={inputCls + " min-w-0"} placeholder={kind === "video" ? "Video URL or YouTube link" : "File URL"} />
      <CldUploadWidget signatureEndpoint="/api/cloudinary/sign" options={{ multiple: false, resourceType: "auto", clientAllowedFormats: formats[kind], sources: ["local", "url"] }} onSuccess={result => {
        if (result.info && typeof result.info === "object" && "secure_url" in result.info) setValue(String(result.info.secure_url));
      }}>
        {({ open }) => <button type="button" onClick={() => open()} className={btnSecondary + " shrink-0 gap-2"}><Upload className="h-4 w-4" />Upload {kind}</button>}
      </CldUploadWidget>
    </div>
  </div>;
}
