"use client";

import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { createCategory } from "@/actions/categories";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";
import { DEFAULT_NAV_COLOR, DEFAULT_NAV_ICON, NAV_COLORS, NAV_GROUPS, NAV_ICONS } from "@/data/categoryNav";
import { btnPrimary, inputCls, labelCls } from "./ui";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export function CategoryForm({
  action = createCategory,
  category,
}: {
  action?: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  category?: Category;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700 md:col-span-2">
          {state.error}
        </div>
      )}
      {category && <input type="hidden" name="id" value={category.id} />}
      <div>
        <label className={labelCls}>Name *</label>
        <input name="name" required defaultValue={category?.name ?? ""} className={inputCls} placeholder="Category name" />
      </div>
      <div>
        <label className={labelCls}>Slug</label>
        <input name="slug" defaultValue={category?.slug ?? ""} className={inputCls} placeholder="auto-generated if empty" />
      </div>
      <div>
        <label className={labelCls}>Image</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            name="image_url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputCls}
            placeholder="https://res.cloudinary.com/..."
          />
          <CldUploadWidget
            options={{ cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(results) => {
              const info = results.info;
              const url = Array.isArray(info)
                ? info[0]?.secure_url
                : (info as { secure_url?: string })?.secure_url;
              if (url) setImageUrl(url);
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
      <div>
        <label className={labelCls}>Description</label>
        <input name="description" defaultValue={category?.description ?? ""} className={inputCls} placeholder="Short description" />
      </div>

      <div className="md:col-span-2 border-t border-gray-100 pt-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Homepage &quot;Shop by Categories&quot; menu</p>
      </div>
      <div>
        <label className={labelCls}>Hindi name (optional)</label>
        <input name="hindi_name" defaultValue={category?.hindi_name ?? ""} className={inputCls} placeholder="e.g. मध्य प्रदेश लोक सेवा आयोग" />
      </div>
      <div>
        <label className={labelCls}>Menu group</label>
        <select name="nav_group" defaultValue={category?.nav_group ?? ""} className={inputCls}>
          <option value="">Not shown in menu</option>
          {NAV_GROUPS.map((group) => (
            <option key={group.id} value={group.id}>{group.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Icon</label>
        <select name="nav_icon" defaultValue={category?.nav_icon ?? DEFAULT_NAV_ICON} className={inputCls}>
          {Object.keys(NAV_ICONS).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Colour</label>
        <select name="nav_color" defaultValue={category?.nav_color ?? DEFAULT_NAV_COLOR} className={inputCls}>
          {Object.keys(NAV_COLORS).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Badge text (optional)</label>
        <input name="nav_badge" defaultValue={category?.nav_badge ?? ""} className={inputCls} placeholder="e.g. Popular, Hot, New 2025" />
      </div>
      <div>
        <label className={labelCls}>Display order</label>
        <input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} className={inputCls} placeholder="0" />
      </div>

      <div className="md:col-span-2">
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving..." : category ? "Update Category" : "Add Category"}
        </button>
      </div>
    </form>
  );
}
