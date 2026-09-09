"use client";

import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { ActionResult } from "@/actions/books";
import { btnPrimary, inputCls, labelCls } from "./ui";

export type WhatsNewSlideRow = {
  id: string;
  badge: string | null;
  kicker: string | null;
  title: string;
  subtitle: string | null;
  cta: string | null;
  href: string | null;
  cover: string | null;
  sort: number;
  is_active: boolean;
};

export type WhatsNewUpdateRow = {
  id: string;
  title: string;
  note: string | null;
  date_text: string | null;
  image: string | null;
  href: string | null;
  sort: number;
  is_active: boolean;
};

function ImageField({
  name,
  label,
  value,
  setValue,
  placeholder = "https://res.cloudinary.com/...",
}: {
  name: string;
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
          placeholder={placeholder}
        />
        <CldUploadWidget
          options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(results) => {
            const info = results.info;
            const url = Array.isArray(info)
              ? info[0]?.secure_url
              : (info as { secure_url?: string })?.secure_url;
            if (url) setValue(url);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="shrink-0 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Upload
            </button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
}

function ActiveCheckbox({ checked }: { checked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <input type="checkbox" name="is_active" defaultChecked={checked} className="h-4 w-4 rounded border-gray-300" />
      Active
    </label>
  );
}

function Submit({ pending, editing }: { pending: boolean; editing: boolean }) {
  return (
    <button type="submit" disabled={pending} className={btnPrimary}>
      {pending ? "Saving..." : editing ? "Update" : "Add"}
    </button>
  );
}

export function WhatsNewSlideForm({
  action,
  slide,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  slide?: WhatsNewSlideRow;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [cover, setCover] = useState(slide?.cover ?? "");

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{state.error}</div>
      )}
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <div>
        <label className={labelCls}>Badge</label>
        <input name="badge" defaultValue={slide?.badge ?? ""} className={inputCls} placeholder='e.g. "NEW RELEASE"' />
      </div>
      <div>
        <label className={labelCls}>Kicker</label>
        <input name="kicker" defaultValue={slide?.kicker ?? ""} className={inputCls} placeholder="e.g. नई पुस्तक रिलीज़" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Title *</label>
        <input name="title" required defaultValue={slide?.title ?? ""} className={inputCls} placeholder="Slide title" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Subtitle</label>
        <input name="subtitle" defaultValue={slide?.subtitle ?? ""} className={inputCls} placeholder="Short subtitle" />
      </div>
      <div>
        <label className={labelCls}>CTA</label>
        <input name="cta" defaultValue={slide?.cta ?? "पुस्तक देखें"} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Link (href)</label>
        <input name="href" defaultValue={slide?.href ?? ""} className={inputCls} placeholder="/product/101" />
      </div>
      <ImageField name="cover" label="Cover Image" value={cover} setValue={setCover} />
      <div className="flex items-end gap-6">
        <div>
          <label className={labelCls}>Sort</label>
          <input type="number" name="sort" defaultValue={slide?.sort ?? 0} className={inputCls} />
        </div>
        <div className="pb-2.5">
          <ActiveCheckbox checked={slide?.is_active ?? true} />
        </div>
      </div>
      <div className="md:col-span-2">
        <Submit pending={isPending} editing={Boolean(slide)} />
      </div>
    </form>
  );
}

export function WhatsNewUpdateForm({
  action,
  update,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  update?: WhatsNewUpdateRow;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [image, setImage] = useState(update?.image ?? "");

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{state.error}</div>
      )}
      {update && <input type="hidden" name="id" value={update.id} />}
      <div className="md:col-span-2">
        <label className={labelCls}>Title *</label>
        <input name="title" required defaultValue={update?.title ?? ""} className={inputCls} placeholder="Update title" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Note</label>
        <input name="note" defaultValue={update?.note ?? ""} className={inputCls} placeholder="Short note (optional)" />
      </div>
      <div>
        <label className={labelCls}>Date (display)</label>
        <input name="date_text" defaultValue={update?.date_text ?? ""} className={inputCls} placeholder='e.g. "12 Sep 2025"' />
      </div>
      <div>
        <label className={labelCls}>Link (href)</label>
        <input name="href" defaultValue={update?.href ?? ""} className={inputCls} placeholder="/product/101" />
      </div>
      <ImageField name="image" label="Image" value={image} setValue={setImage} />
      <div className="flex items-end gap-6">
        <div>
          <label className={labelCls}>Sort</label>
          <input type="number" name="sort" defaultValue={update?.sort ?? 0} className={inputCls} />
        </div>
        <div className="pb-2.5">
          <ActiveCheckbox checked={update?.is_active ?? true} />
        </div>
      </div>
      <div className="md:col-span-2">
        <Submit pending={isPending} editing={Boolean(update)} />
      </div>
    </form>
  );
}
