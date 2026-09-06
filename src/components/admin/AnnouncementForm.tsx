"use client";

import { useActionState } from "react";
import { createAnnouncement } from "@/actions/announcements";
import { btnPrimary, inputCls, labelCls } from "./ui";

export function AnnouncementForm() {
  const [state, formAction, isPending] = useActionState(createAnnouncement, {});

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700">
          {state.error}
        </div>
      )}
      <div>
        <label className={labelCls}>Announcement text *</label>
        <input
          name="text"
          required
          className={inputCls}
          placeholder="e.g. New releases available now"
        />
      </div>
      <div>
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Adding..." : "Add Announcement"}
        </button>
      </div>
    </form>
  );
}
