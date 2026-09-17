"use client";

import { useState } from "react";
import { X, Eye } from "lucide-react";
import { StatusSelect } from "./StatusSelect";
import type { ActionResult } from "@/actions/books";

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

export function InquiryDetailsButton({
  inquiry,
  statuses,
  updateStatus,
}: {
  inquiry: Inquiry;
  statuses: { value: string; label: string }[];
  updateStatus: (id: string, status: string) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                <p className="text-xs text-gray-500">
                  Submitted {new Date(inquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Email</h4>
                  <p className="break-all text-sm text-gray-900">{inquiry.email ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</h4>
                  <p className="text-sm text-gray-900">{inquiry.phone ?? "—"}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Message</h4>
                <p className="whitespace-pre-wrap text-sm text-gray-700">{inquiry.message}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</h4>
                <StatusSelect id={inquiry.id} value={inquiry.status} options={statuses} action={updateStatus} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
