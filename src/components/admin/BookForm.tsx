"use client";

import { useEffect, useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputCls, labelCls } from "./ui";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

const LANGUAGES = ["Hindi", "English", "Sanskrit", "Urdu", "Marathi", "Other"];
const BINDINGS = ["Paperback", "Hardcover", "eBook"];

export function BookForm({
  action,
  book,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  book?: Book;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [categories, setCategories] = useState<Pick<Category, "id" | "name">[]>([]);
  const [imageUrl, setImageUrl] = useState(book?.image_url ?? "");
  const [highlightsText, setHighlightsText] = useState<string>(() =>
    Array.isArray(book?.highlights) ? (book?.highlights as string[]).join("\n") : "",
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  const highlightsJson = JSON.stringify(
    highlightsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean),
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700">
          {state.error}
        </div>
      )}
      {book && <input type="hidden" name="id" value={book.id} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" required defaultValue={book?.title ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Hindi Title</label>
          <input name="hindi_title" defaultValue={book?.hindi_title ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <input name="subtitle" defaultValue={book?.subtitle ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Author</label>
          <input name="author" defaultValue={book?.author ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select name="category_id" defaultValue={book?.category_id ?? ""} className={inputCls}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>ISBN</label>
          <input name="isbn" defaultValue={book?.isbn ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Edition</label>
          <input name="edition" defaultValue={book?.edition ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Language</label>
          <select name="language" defaultValue={book?.language ?? ""} className={inputCls}>
            <option value="">Select</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Exam</label>
          <input name="exam" defaultValue={book?.exam ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Format</label>
          <input name="format" defaultValue={book?.format ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={book?.price ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Original Price (₹)</label>
          <input
            type="number"
            step="0.01"
            name="original_price"
            defaultValue={book?.original_price ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Discount %</label>
          <input
            type="number"
            name="discount_percent"
            defaultValue={book?.discount_percent ?? 0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            defaultValue={book?.rating ?? 0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Reviews Count</label>
          <input
            type="number"
            name="reviews_count"
            defaultValue={book?.reviews_count ?? 0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Badge</label>
          <input name="badge" defaultValue={book?.badge ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Badge Color</label>
          <input name="badge_color" defaultValue={book?.badge_color ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Pages</label>
          <input type="number" name="pages" defaultValue={book?.pages ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Publication</label>
          <input name="publication" defaultValue={book?.publication ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Binding</label>
          <select name="binding" defaultValue={book?.binding ?? ""} className={inputCls}>
            <option value="">Select</option>
            {BINDINGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Cover Image</label>
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
        <div className="md:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            defaultValue={book?.description ?? ""}
            rows={4}
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Highlights (one per line)</label>
          <textarea
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            rows={4}
            className={inputCls}
            placeholder={"Point one\nPoint two"}
          />
          <input type="hidden" name="highlights" value={highlightsJson} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <Checkbox name="in_stock" label="In Stock" defaultChecked={book?.in_stock ?? true} />
        <Checkbox name="is_bestseller" label="Bestseller" defaultChecked={book?.is_bestseller ?? false} />
        <Checkbox name="is_new_release" label="New Release" defaultChecked={book?.is_new_release ?? false} />
        <Checkbox name="is_featured" label="Featured" defaultChecked={book?.is_featured ?? false} />
        <Checkbox name="show_in_hero" label="Show in Hero" defaultChecked={book?.show_in_hero ?? false} />
        <Checkbox name="is_active" label="Active" defaultChecked={book?.is_active ?? true} />
      </div>

      <button type="submit" disabled={isPending} className={btnPrimary}>
        {isPending ? "Saving..." : book ? "Update Book" : "Create Book"}
      </button>
    </form>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
      {label}
    </label>
  );
}
