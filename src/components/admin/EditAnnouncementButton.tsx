"use client";

import { useState } from "react";
import { X, Pencil } from "lucide-react";
import { AnnouncementForm } from "./AnnouncementForm";
import type { ActionResult } from "@/actions/books";
import type { Database } from "@/types/database";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

export function EditAnnouncementButton({
  action,
  announcement,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  announcement: Announcement;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-900"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Announcement</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AnnouncementForm action={action} announcement={announcement} />
          </div>
        </div>
      )}
    </>
  );
}
