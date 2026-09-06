"use client";

import { useTransition } from "react";
import type { ActionResult } from "@/actions/books";
import { btnDanger } from "./ui";

export function DeleteButton({
  action,
  id,
  label = "Delete",
}: {
  action: (id: string) => Promise<ActionResult>;
  id: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={() => startTransition(async () => void (await action(id)))}>
      <button type="submit" disabled={isPending} className={btnDanger}>
        {isPending ? "Deleting..." : label}
      </button>
    </form>
  );
}
