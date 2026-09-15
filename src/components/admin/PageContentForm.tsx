"use client";

import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { savePageContent } from "@/actions/page-content";
import { contentDefaults, HERO_ITEM_DEFAULT, type PageKind } from "@/lib/page-content-shared";
import { HERO_BOOKS } from "@/data/heroContent";
import ImageUploadField from "./ImageUploadField";
import { btnDanger, btnPrimary, btnSecondary, card, inputCls, labelCls, tableTd, tableTh } from "./ui";

type Content = { settings: Record<string, string>; items: Record<string, string>[] };
const gradients = ["from-red-600 to-amber-700", "from-blue-700 to-indigo-900", "from-emerald-700 to-teal-900", "from-purple-700 to-violet-950", "from-amber-600 to-rose-700", "from-slate-700 to-zinc-900", "from-amber-600 to-orange-800", "from-rose-600 to-red-900"];
const labels: Record<string, string> = { dept: "Department", bio: "Biography", id: "Article ID", imageBg: "Banner colour", gradient: "Banner colour", bgColor: "Cover background", coverType: "Cover artwork", ctaHref: "Button URL", ctaLabel: "Button text", ctaBadge: "Section badge", ctaTitle: "Section title", ctaDescription: "Section description", badge1: "First badge", badge2: "Second badge", badge3: "Third badge" };
const label = (key: string) => labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
const numericFields = ["price", "originalPrice", "rating", "reviewsCount"];

export default function PageContentForm({ kind, initial }: { kind: PageKind; initial: Content }) {
  const [content, setContent] = useState(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const editorRef = useRef<HTMLDivElement>(null);
  const entryLabel = kind === "hero" ? "book" : kind === "team" ? "member" : "article";
  const title = entryLabel[0].toUpperCase() + entryLabel.slice(1);
  const secondaryKey = kind === "team" ? "role" : "category";
  const active = selected === null ? null : content.items[selected];

  function change(update: (previous: Content) => Content) {
    setContent(update);
    setDirty(true);
    setMessage({});
  }
  function edit(index: number) {
    setSelected(index);
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function add() {
    const item = kind === "hero" ? { ...HERO_ITEM_DEFAULT } : Object.fromEntries(Object.keys(contentDefaults[kind].items[0]).map(key => [key, key === "gradient" || key === "imageBg" ? gradients[0] : key === "id" ? crypto.randomUUID() : ""]));
    change(previous => ({ ...previous, items: [...previous.items, item] }));
    edit(content.items.length);
  }
  function move(index: number, direction: number) {
    const destination = index + direction;
    if (destination < 0 || destination >= content.items.length) return;
    change(previous => {
      const items = [...previous.items];
      [items[index], items[destination]] = [items[destination], items[index]];
      return { ...previous, items };
    });
    if (selected === index) setSelected(destination);
    else if (selected === destination) setSelected(index);
  }
  function remove(index: number) {
    if (!window.confirm(`Remove this ${entryLabel}? Save changes to apply.`)) return;
    change(previous => ({ ...previous, items: previous.items.filter((_, i) => i !== index) }));
    if (selected === index) setSelected(null);
    else if (selected !== null && selected > index) setSelected(selected - 1);
  }
  function field(key: string, value: string, update: (value: string) => void, id: string) {
    if (key === "image") return <ImageUploadField key={key} id={id} label={kind === "team" ? "Photo (optional)" : "Cover image (optional)"} value={value} onChange={update} />;
    const choices = key === "bgColor" ? HERO_BOOKS.map(book => book.bgColor) : key === "coverType" ? ["hindi", "polity", "essay", "history", "constitution", "law", "gk", "economy", "science", "geography"] : gradients;
    const isSelect = ["gradient", "imageBg", "bgColor", "coverType"].includes(key);
    const multiline = ["bio", "excerpt", "ctaDescription"].includes(key);
    return <div key={key} className={multiline ? "md:col-span-2" : ""}>
      <label className={labelCls} htmlFor={id}>{kind === "hero" && key === "id" ? "Linked product ID" : label(key)}</label>
      {isSelect ? <select id={id} className={inputCls + " mt-1"} value={value} onChange={event => update(event.target.value)}>{Array.from(new Set([...choices, value])).map(colour => <option key={colour} value={colour}>{colour}</option>)}</select> : multiline ? <textarea id={id} className={inputCls + " mt-1"} rows={3} value={value} onChange={event => update(event.target.value)} /> : <input id={id} className={inputCls + " mt-1"} type={numericFields.includes(key) ? "number" : "text"} min={numericFields.includes(key) ? 0 : undefined} max={key === "rating" ? 5 : undefined} step={key === "reviewsCount" ? 1 : "any"} value={value} onChange={event => update(event.target.value)} />}
    </div>;
  }

  return <form className="space-y-6" onSubmit={event => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const result = await savePageContent(kind, JSON.stringify(content));
        setMessage(result);
        if (result.success) setDirty(false);
      } catch { setMessage({ error: "Changes could not be saved. Please try again." }); }
    });
  }}>
    <fieldset disabled={pending} className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{content.items.length} {entryLabel}{content.items.length === 1 ? "" : "s"}{dirty ? " - Unsaved changes" : ""}</p>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={add} className={btnSecondary + " gap-2"}><Plus className="h-4 w-4" />Add {title}</button><button type="submit" className={btnPrimary}>{pending ? "Saving..." : "Save changes"}</button></div>
      </div>
      {message.error && <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{message.error}</div>}
      {message.success && <div role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message.success}</div>}
      {active && selected !== null && <div ref={editorRef} className={card + " scroll-mt-6 p-6"}>
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-gray-900">Edit {title}</h2><button type="button" onClick={() => setSelected(null)} className={btnSecondary}>Close editor</button></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{Object.entries(active).map(([key, value]) => field(key, value, value => change(previous => ({ ...previous, items: previous.items.map((item, index) => index === selected ? { ...item, [key]: value } : item) })), `item-${selected}-${key}`))}</div>
        <p className="mt-4 text-sm text-gray-500">Use Save changes to publish your edits.</p>
      </div>}
      <div className={card}>
        <div className="border-b border-gray-200 px-6 py-4"><h2 className="text-lg font-semibold text-gray-900">{kind === "hero" ? "Carousel books" : kind === "team" ? "Team members" : "Blog articles"}</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className={tableTh}>Order</th><th className={tableTh}>{kind === "team" ? "Name" : "Title"}</th><th className={tableTh}>{label(secondaryKey)}</th><th className={tableTh}>Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{content.items.map((item, index) => <tr key={index} className={selected === index ? "bg-brand-50" : ""}>
            <td className={tableTd}>{index + 1}</td><td className={tableTd + " min-w-48 font-medium"}>{item.name || item.title || `New ${entryLabel}`}</td><td className={tableTd}>{item[secondaryKey] || "-"}</td>
            <td className={tableTd}><div className="flex items-center gap-2 whitespace-nowrap"><button type="button" onClick={() => edit(index)} className="text-sm font-medium text-brand-600 hover:underline">Edit</button><button type="button" aria-label={`Move ${entryLabel} ${index + 1} up`} title="Move up" disabled={index === 0} onClick={() => move(index, -1)} className={btnSecondary + " !p-1.5 disabled:opacity-40"}><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label={`Move ${entryLabel} ${index + 1} down`} title="Move down" disabled={index === content.items.length - 1} onClick={() => move(index, 1)} className={btnSecondary + " !p-1.5 disabled:opacity-40"}><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => remove(index)} className={btnDanger}>Delete</button></div></td>
          </tr>)}{content.items.length === 0 && <tr><td className={tableTd} colSpan={4}>No {entryLabel}s yet. Add a {entryLabel} to get started.</td></tr>}</tbody>
        </table></div>
      </div>
      {Object.keys(content.settings).length > 0 && <div className={card + " p-6"}><h2 className="mb-4 text-lg font-semibold text-gray-900">Page settings</h2><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{Object.entries(content.settings).map(([key, value]) => field(key, value, value => change(previous => ({ ...previous, settings: { ...previous.settings, [key]: value } })), `setting-${key}`))}</div></div>}
    </fieldset>
  </form>;
}
