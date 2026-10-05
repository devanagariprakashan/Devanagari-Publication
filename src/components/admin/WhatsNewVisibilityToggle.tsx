"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { setWhatsNewVisible } from "@/actions/site-sections";
import { card } from "./ui";

export function WhatsNewVisibilityToggle({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(enabled);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    setError("");
    startTransition(async () => {
      const result = await setWhatsNewVisible(next);
      if (result.error) {
        setVisible(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div className={card + " flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            visible ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">&quot;What&apos;s New&quot; section on the homepage</p>
          <p className="text-xs text-gray-500">
            {visible
              ? "Visible to visitors: the featured carousel and the Latest Updates panel."
              : "Hidden: visitors don't see this section. Your slides and updates are kept."}
          </p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={visible}
        aria-label="Show What's New section on the homepage"
        onClick={toggle}
        disabled={pending}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-60 ${
          visible ? "bg-brand-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            visible ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
