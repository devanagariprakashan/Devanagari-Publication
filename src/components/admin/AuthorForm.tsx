"use client";

import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";
import { createAuthor } from "@/actions/authors";
import { btnPrimary, inputCls, labelCls } from "./ui";

type Author = Database["public"]["Tables"]["authors"]["Row"];

export function AuthorForm({
  action = createAuthor,
  author,
}: {
  action?: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  author?: Author;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [imageUrl, setImageUrl] = useState(author?.image_url ?? "");

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700 md:col-span-2">
          {state.error}
        </div>
      )}
      {author && <input type="hidden" name="id" value={author.id} />}
      <div>
        <label className={labelCls}>Name *</label>
        <input name="name" required defaultValue={author?.name ?? ""} className={inputCls} placeholder="Author name" />
      </div>
      <div>
        <label className={labelCls}>Role</label>
        <input name="role" defaultValue={author?.role ?? ""} className={inputCls} placeholder="e.g. Author, Editor" />
      </div>
      <div>
        <label className={labelCls}>Short Role</label>
        <input name="short_role" defaultValue={author?.short_role ?? ""} className={inputCls} placeholder="e.g. Author" />
      </div>
      <div>
        <label className={labelCls}>Photo</label>
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
        <label className={labelCls}>Bio</label>
        <textarea name="bio" rows={3} defaultValue={author?.bio ?? ""} className={inputCls} placeholder="Short biography" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving..." : author ? "Update Author" : "Add Author"}
        </button>
      </div>
    </form>
  );
}
