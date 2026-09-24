"use client";

import { useActionState, useState } from "react";
import { Megaphone, Plus, Save } from "lucide-react";
import { createAnnouncement } from "@/actions/announcements";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";
import { inputCls, labelCls } from "./ui";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

export function AnnouncementForm({
  action = createAnnouncement,
  announcement,
}: {
  action?: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  announcement?: Announcement;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [text, setText] = useState(announcement?.text ?? "");

  return (
    <form action={formAction} className="space-y-3">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700">
          {state.error}
        </div>
      )}
      {announcement && <input type="hidden" name="id" value={announcement.id} />}
      <div>
        <label className={labelCls}>Announcement text *</label>
        <input
          name="text"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={inputCls + " mt-1"}
          placeholder="e.g. New releases available now"
        />
      </div>
      {text && (
        <div>
          <span className="text-xs font-medium text-gray-500">Preview (shown in the bell dropdown)</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <Megaphone className="h-4 w-4 shrink-0 text-brand-600" />
            <span className="text-sm text-gray-700">{text}</span>
          </div>
        </div>
      )}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {announcement ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isPending ? "Saving..." : announcement ? "Update Announcement" : "Add Announcement"}
        </button>
      </div>
    </form>
  );
}
