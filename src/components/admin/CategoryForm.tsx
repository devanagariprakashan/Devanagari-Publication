"use client";

import { useActionState } from "react";
import { createCategory } from "@/actions/categories";
import { btnPrimary, inputCls, labelCls } from "./ui";

export function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700 md:col-span-2">
          {state.error}
        </div>
      )}
      <div>
        <label className={labelCls}>Name *</label>
        <input name="name" required className={inputCls} placeholder="Category name" />
      </div>
      <div>
        <label className={labelCls}>Slug</label>
        <input name="slug" className={inputCls} placeholder="auto-generated if empty" />
      </div>
      <div>
        <label className={labelCls}>Image URL</label>
        <input name="image_url" className={inputCls} placeholder="https://..." />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <input name="description" className={inputCls} placeholder="Short description" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Adding..." : "Add Category"}
        </button>
      </div>
    </form>
  );
}
