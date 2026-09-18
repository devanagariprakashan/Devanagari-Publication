"use client";

import { useTransition } from "react";
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

  return (
    <form
      action={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => void (await action(id)));
      }}
    >
      <button type="submit" disabled={isPending} className={btnDanger}>
        {isPending ? "Deleting..." : label}
      </button>
    </form>
  );
}
