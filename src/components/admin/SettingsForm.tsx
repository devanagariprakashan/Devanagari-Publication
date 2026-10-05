"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { btnPrimary } from "./ui";

export type SettingsState = { success?: string; error?: string; at?: number };

export function SettingsForm({
  action,
  children,
}: {
  action: (prev: SettingsState, formData: FormData) => Promise<SettingsState>;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [visible, setVisible] = useState(false);

  // Every save returns a fresh `at`, so the notice reappears even when the message text is the same.
  useEffect(() => {
    if (!state.at) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [state.at]);

  return (
    <form action={formAction} className="space-y-6">
      {visible && (state.success || state.error) && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
            state.error ? "bg-red-50 text-red-800 ring-red-200" : "bg-emerald-50 text-emerald-800 ring-emerald-200"
          }`}
        >
          {state.error ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
          <span>{state.error ?? state.success}</span>
        </div>
      )}

      {children}

      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:-mx-8 lg:px-8">
        <p className={`text-sm ${state.error && !pending ? "text-red-600" : state.success && !pending && visible ? "text-emerald-600" : "text-gray-500"}`}>
          {pending
            ? "Saving your settings..."
            : state.error && visible
              ? state.error
              : state.success && visible
                ? state.success
                : "Remember to save after making changes."}
        </p>
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
