"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/actions/books";
import { btnDanger } from "./ui";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmMessage = "Delete this? This cannot be undone.",
}: {
  action: (id: string) => Promise<ActionResult>;
  id: string;
  label?: string;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <form
        action={() => {
          if (!window.confirm(confirmMessage)) return;
          startTransition(async () => {
            const result = await action(id);
            setError(result.error ?? null);
          });
        }}
      >
        <button type="submit" disabled={isPending} className={btnDanger}>
          {isPending ? "Deleting..." : label}
        </button>
      </form>
      {error && <p role="alert" className="mt-1 max-w-[16rem] text-xs text-red-700">{error}</p>}
    </div>
  );
}
