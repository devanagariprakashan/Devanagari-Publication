"use client";

import { useEffect, useActionState, useState } from "react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { Save, AlertCircle, Upload, Plus, BookOpen } from "lucide-react";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { isHexColor, contrastTextColor } from "@/lib/color";
import { btnPrimary, btnSecondary, card, inputCls, labelCls, pageTitle } from "./ui";
import MediaUploadField from "./MediaUploadField";
import MultiImageUploadField from "./MultiImageUploadField";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

const LANGUAGES = ["Hindi", "English", "Sanskrit", "Urdu", "Marathi", "Other"];
const BINDINGS = ["Paperback", "Hardcover", "eBook"];
const DEFAULT_BADGE_COLOR = "#C61821";

const BADGE_PRESETS = [
  { name: "Crimson Red", color: "#C61821" },
  { name: "Saffron Gold", color: "#D97706" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Royal Blue", color: "#2563EB" },
  { name: "Purple", color: "#7C3AED" },
  { name: "Rose Pink", color: "#E11D48" },
  { name: "Slate", color: "#0F172A" },
];

const DISCOUNT_SHORTCUTS = [10, 15, 20, 25, 30, 40, 50];

const HIGHLIGHT_TEMPLATES = [
  "Complete & revised syllabus coverage for 2025-26",
  "Chapter-wise solved previous year questions (PYQs)",
  "15 full-length mock practice sets with step-by-step solutions",
  "Fast-track revision mind maps & infographics included",
  "Bilingual concept explanations in Hindi & English",
  "Verified answer keys with expert notes",
];

export function BookForm({
  action,
  book,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  book?: Book;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [categories, setCategories] = useState<Pick<Category, "id" | "name">[]>([]);
  const [authors, setAuthors] = useState<{ name: string }[]>([]);

  // Basic details
  const [title, setTitle] = useState(book?.title ?? "");
  const [hindiTitle, setHindiTitle] = useState(book?.hindi_title ?? "");
  const [subtitle, setSubtitle] = useState(book?.subtitle ?? "");
  const [authorChoice, setAuthorChoice] = useState<string>(book?.author ?? "");
  const [authorCustom, setAuthorCustom] = useState<string>("");
  const [categoryId, setCategoryId] = useState(book?.category_id ?? "");
  const [language, setLanguage] = useState(book?.language ?? "Hindi");
  const [binding, setBinding] = useState(book?.binding ?? "Paperback");
  const [pages, setPages] = useState<string>(book?.pages ? String(book.pages) : "");
  const [edition, setEdition] = useState(book?.edition ?? "");
  const [exam, setExam] = useState(book?.exam ?? "");
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [format, setFormat] = useState(book?.format ?? "");
  const [publication, setPublication] = useState(book?.publication ?? "Devanagari Publication");

  // Pricing
  const [price, setPrice] = useState<string>(book?.price ? String(book.price) : "");
  const [originalPrice, setOriginalPrice] = useState<string>(
    book?.original_price ? String(book.original_price) : ""
  );
  const [discountPercent, setDiscountPercent] = useState<string>(
    book?.discount_percent !== undefined && book?.discount_percent !== null
      ? String(book.discount_percent)
      : "0"
  );

  // Badge & media
  const [badgeText, setBadgeText] = useState(book?.badge ?? "");
  const [badgeColor, setBadgeColor] = useState(
    book?.badge_color && isHexColor(book.badge_color) ? book.badge_color : DEFAULT_BADGE_COLOR
  );
  const [imageUrl, setImageUrl] = useState(book?.image_url ?? "");
  const [images, setImages] = useState<string[]>(
    Array.isArray(book?.images) ? (book.images as string[]) : []
  );

  // Description & highlights
  const [description, setDescription] = useState(book?.description ?? "");
  const [highlightsText, setHighlightsText] = useState<string>(() =>
    Array.isArray(book?.highlights) ? (book?.highlights as string[]).join("\n") : ""
  );

  // Sample files
  const [demoFileUrl, setDemoFileUrl] = useState(book?.demo_file_url ?? "");
  const [demoVideoUrl, setDemoVideoUrl] = useState(book?.demo_video_url ?? "");

  // Visibility toggles
  const [inStock, setInStock] = useState<boolean>(book?.in_stock ?? true);
  const [isBestseller, setIsBestseller] = useState<boolean>(book?.is_bestseller ?? false);
  const [isNewRelease, setIsNewRelease] = useState<boolean>(book?.is_new_release ?? false);
  const [isFeatured, setIsFeatured] = useState<boolean>(book?.is_featured ?? false);
  const [showInHero, setShowInHero] = useState<boolean>(book?.show_in_hero ?? false);
  const [isActive, setIsActive] = useState<boolean>(book?.is_active ?? true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));

    supabase
      .from("authors")
      .select("name")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        const list = data ?? [];
        setAuthors(list);
        if (book?.author && !list.some((a) => a.name === book.author)) {
          setAuthorChoice("__other__");
          setAuthorCustom(book.author);
        }
      });
  }, [book?.author]);

  // Pricing calculations
  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    const orig = parseFloat(val);
    const sell = parseFloat(price);
    if (!isNaN(orig) && orig > 0 && !isNaN(sell) && sell >= 0 && sell <= orig) {
      const disc = Math.round(((orig - sell) / orig) * 100);
      setDiscountPercent(String(disc));
    }
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    const sell = parseFloat(val);
    const orig = parseFloat(originalPrice);
    if (!isNaN(orig) && orig > 0 && !isNaN(sell) && sell >= 0 && sell <= orig) {
      const disc = Math.round(((orig - sell) / orig) * 100);
      setDiscountPercent(String(disc));
    }
  };

  const handleDiscountChange = (val: string) => {
    setDiscountPercent(val);
    const disc = parseFloat(val);
    const orig = parseFloat(originalPrice);
    if (!isNaN(orig) && orig > 0 && !isNaN(disc) && disc >= 0 && disc <= 100) {
      const sell = Math.round(orig * (1 - disc / 100));
      setPrice(String(sell));
    }
  };

  const applyDiscountShortcut = (pct: number) => {
    setDiscountPercent(String(pct));
    const orig = parseFloat(originalPrice);
    if (!isNaN(orig) && orig > 0) {
      const sell = Math.round(orig * (1 - pct / 100));
      setPrice(String(sell));
    }
  };

  const addHighlightTemplate = (template: string) => {
    setHighlightsText((prev) => {
      const lines = prev.split("\n").filter((l) => l.trim().length > 0);
      if (lines.includes(template)) return prev;
      return lines.length > 0 ? `${prev.trim()}\n${template}` : template;
    });
  };

  const numPrice = parseFloat(price) || 0;
  const numOrigPrice = parseFloat(originalPrice) || 0;
  const savings = numOrigPrice > numPrice ? numOrigPrice - numPrice : 0;

  const highlightsJson = JSON.stringify(
    highlightsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
  );

  return (
    <form action={formAction} className="space-y-6">
      {book && <input type="hidden" name="id" value={book.id} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className={pageTitle}>{book ? "Edit Book" : "Add New Book"}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {book
              ? `Editing "${book.title}"`
              : "Fill in the details below to add a new book to the catalog."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/books" className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" disabled={isPending} className={btnPrimary}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : book ? "Save Changes" : "Add Book"}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Basic Details */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bhartiya Nyaya Sanhita (BNS 2024 Edition)"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="hindi_title">
              Hindi Title
            </label>
            <input
              id="hindi_title"
              name="hindi_title"
              value={hindiTitle}
              onChange={(e) => setHindiTitle(e.target.value)}
              placeholder="e.g. भारतीय न्याय संहिता 2024"
              className={inputCls + " mt-1 font-serif"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="subtitle">
              Subtitle
            </label>
            <input
              id="subtitle"
              name="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Complete Bare Act with Section-by-Section Analysis"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="author_choice">
              Author
            </label>
            <select
              id="author_choice"
              value={authorChoice}
              onChange={(e) => setAuthorChoice(e.target.value)}
              className={inputCls + " mt-1"}
            >
              <option value="">Unassigned</option>
              {authors.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
              <option value="__other__">Other (type manually)</option>
            </select>
            {authorChoice === "__other__" && (
              <input
                name="author"
                value={authorCustom}
                onChange={(e) => setAuthorCustom(e.target.value)}
                className={inputCls + " mt-2"}
                placeholder="Enter author or editorial board name"
              />
            )}
            {authorChoice !== "__other__" && (
              <input type="hidden" name="author" value={authorChoice} />
            )}
          </div>

          <div>
            <label className={labelCls} htmlFor="category_id">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputCls + " mt-1"}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="exam">
              Exam / Audience
            </label>
            <input
              id="exam"
              name="exam"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g. MPPSC, UPSC, Civil Judge, ADPO"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="language">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputCls + " mt-1"}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="edition">
              Edition
            </label>
            <input
              id="edition"
              name="edition"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="e.g. 2025-26"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="binding">
              Binding
            </label>
            <select
              id="binding"
              name="binding"
              value={binding}
              onChange={(e) => setBinding(e.target.value)}
              className={inputCls + " mt-1"}
            >
              {BINDINGS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="pages">
              Pages
            </label>
            <input
              id="pages"
              type="number"
              name="pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g. 540"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="isbn">
              ISBN
            </label>
            <input
              id="isbn"
              name="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-81-945678-1-2"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="format">
              Format
            </label>
            <input
              id="format"
              name="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g. Paperback"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="publication">
              Publisher
            </label>
            <input
              id="publication"
              name="publication"
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              className={inputCls + " mt-1"}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Pricing</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="original_price">
              MRP (₹)
            </label>
            <input
              id="original_price"
              type="number"
              step="0.01"
              name="original_price"
              value={originalPrice}
              onChange={(e) => handleOriginalPriceChange(e.target.value)}
              placeholder="650"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="price">
              Selling Price (₹) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              name="price"
              required
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="499"
              className={inputCls + " mt-1"}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="discount_percent">
              Discount (%)
            </label>
            <input
              id="discount_percent"
              type="number"
              min="0"
              max="100"
              name="discount_percent"
              value={discountPercent}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="23"
              className={inputCls + " mt-1"}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Quick discount:</span>
          {DISCOUNT_SHORTCUTS.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyDiscountShortcut(pct)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                discountPercent === String(pct)
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>

        {savings > 0 && (
          <p className="mt-3 text-sm text-emerald-700">
            Customer saves ₹{savings.toFixed(0)} ({discountPercent}% off ₹{numOrigPrice.toFixed(0)})
          </p>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-900">Promotional Badge (optional)</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="badge_text_input">
                Badge Text
              </label>
              <input
                id="badge_text_input"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. BESTSELLER"
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="badge_color_input">
                Badge Color
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="badge_color_input"
                  type="color"
                  value={isHexColor(badgeColor) ? badgeColor : DEFAULT_BADGE_COLOR}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  placeholder="#C61821"
                  className={inputCls + " font-mono uppercase"}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Presets:</span>
            {BADGE_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setBadgeColor(p.color)}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>

          {badgeText && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              Preview:
              <span
                className="rounded px-2 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: isHexColor(badgeColor) ? badgeColor : DEFAULT_BADGE_COLOR,
                  color: contrastTextColor(isHexColor(badgeColor) ? badgeColor : DEFAULT_BADGE_COLOR),
                }}
              >
                {badgeText}
              </span>
            </div>
          )}

          <input type="hidden" name="badge" value={badgeText} />
          <input type="hidden" name="badge_color" value={badgeColor} />
        </div>
      </div>

      {/* Images */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Images</h2>
        <div>
          <label className={labelCls} htmlFor="image_url">
            Cover Image URL *
          </label>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            <input
              id="image_url"
              name="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or paste image URL"
              className={inputCls}
            />
            <CldUploadWidget
              options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                resourceType: "image",
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "avif"],
              }}
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
                <button type="button" onClick={() => open()} className={btnSecondary}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </button>
              )}
            </CldUploadWidget>
          </div>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Cover preview"
              className="mt-3 h-32 w-24 rounded-md border border-gray-200 object-cover"
            />
          ) : (
            <div className="mt-3 flex h-32 w-24 items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-300">
              <BookOpen className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <MultiImageUploadField
            label="Additional Images (optional)"
            values={images}
            onChange={setImages}
          />
          <input type="hidden" name="images" value={JSON.stringify(images)} />
        </div>
      </div>

      {/* Description */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Description</h2>
        <div>
          <label className={labelCls} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Give an overview of what the book covers and why it's useful for the reader..."
            className={inputCls + " mt-1"}
          />
        </div>

        <div className="mt-4">
          <label className={labelCls} htmlFor="highlights_text">
            Highlights (one per line)
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500">Suggestions:</span>
            {HIGHLIGHT_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addHighlightTemplate(tpl)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                <Plus className="h-3 w-3" />
                {tpl.slice(0, 32)}...
              </button>
            ))}
          </div>
          <textarea
            id="highlights_text"
            rows={4}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            placeholder={"Comprehensive coverage of 2025 revised syllabus\nChapter-wise solved previous year questions (PYQs)\n15 full-length mock practice sets with detailed solutions"}
            className={inputCls + " mt-2"}
          />
          <input type="hidden" name="highlights" value={highlightsJson} />
        </div>
      </div>

      {/* Sample Files */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Sample Files</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MediaUploadField
            name="demo_file_url"
            label="Sample PDF"
            kind="file"
            initialValue={demoFileUrl}
          />
          <MediaUploadField
            name="demo_video_url"
            label="Video (YouTube or MP4 link)"
            kind="video"
            initialValue={demoVideoUrl}
          />
        </div>
      </div>

      {/* Visibility */}
      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Visibility & Tags</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="in_stock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Published (visible on site)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_bestseller"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_new_release"
              checked={isNewRelease}
              onChange={(e) => setIsNewRelease(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            New Release
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="show_in_hero"
              checked={showInHero}
              onChange={(e) => setShowInHero(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Show on Homepage Banner
          </label>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-gray-200 pt-4">
        <Link href="/admin/books" className={btnSecondary}>
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className={btnPrimary}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : book ? "Save Changes" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
