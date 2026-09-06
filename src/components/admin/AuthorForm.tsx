"use client";

import { useActionState } from "react";
import { createAuthor } from "@/actions/authors";
import { btnPrimary, inputCls, labelCls } from "./ui";

export function AuthorForm() {
  const [state, formAction, isPending] = useActionState(createAuthor, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700 md:col-span-2">
          {state.error}
        </div>
      )}
      <div>
        <label className={labelCls}>Name *</label>
        <input name="name" required className={inputCls} placeholder="Author name" />
      </div>
      <div>
        <label className={labelCls}>Role</label>
        <input name="role" className={inputCls} placeholder="e.g. Author, Editor" />
      </div>
      <div>
        <label className={labelCls}>Short Role</label>
        <input name="short_role" className={inputCls} placeholder="e.g. Author" />
      </div>
      <div>
        <label className={labelCls}>Image URL</label>
        <input name="image_url" className={inputCls} placeholder="https://..." />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Bio</label>
        <textarea name="bio" rows={3} className={inputCls} placeholder="Short biography" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Adding..." : "Add Author"}
        </button>
      </div>
    </form>
  );
}
