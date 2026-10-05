"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import type { ActionResult } from "@/actions/books";
import { btnDanger, btnSecondary } from "./ui";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  itemName,
  confirmMessage = "This cannot be undone.",
}: {
  action: (id: string) => Promise<ActionResult>;
  id: string;
  label?: string;
  itemName?: string;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isPending]);

  const confirmDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (result.error) {
        setError(result.error);
      }
      setOpen(false);
    });
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)} disabled={isPending} className={btnDanger}>
        {isPending ? "Deleting..." : label}
      </button>
      {error && <p role="alert" className="mt-1 max-w-[16rem] text-xs text-red-700">{error}</p>}

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-sm rounded-lg bg-white p-6 text-left shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 id="delete-dialog-title" className="text-base font-semibold text-gray-900">
                  {itemName ? `Delete "${itemName}"?` : "Delete this item?"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{confirmMessage}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} disabled={isPending} className={btnSecondary}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
