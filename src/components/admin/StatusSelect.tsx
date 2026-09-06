"use client";

import { useTransition } from "react";
import type { ActionResult } from "@/actions/books";

export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  action: (id: string, status: string) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) =>
        startTransition(async () => void (await action(id, e.target.value)))
      }
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
