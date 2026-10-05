"use client";

import { useState, useTransition } from "react";
import {
  ExternalLink,
  X,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { trackShipmentAction } from "@/actions/shipments";
import type { ShipmentTracking } from "@/lib/ithink";
import ShipmentTimeline from "@/components/ShipmentTimeline";
import { btnSecondary } from "./ui";

export function TrackShipmentButton({ awb }: { awb: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    setOpen(true);
    setError(null);
    setTracking(null);
    startTransition(async () => {
      const result = await trackShipmentAction(awb);
      if ("error" in result) setError(result.error);
      else setTracking(result.tracking);
    });
  };

  const copyAwb = () => {
    navigator.clipboard.writeText(awb);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button type="button" onClick={load} className={btnSecondary + " px-3 py-1.5 text-xs"}>
        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
        Track Parcel
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Track Shipment</h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="font-mono text-xs text-gray-600">AWB: {awb}</span>
                  <button
                    type="button"
                    onClick={copyAwb}
                    title="Copy AWB number"
                    className="rounded p-0.5 text-gray-400 hover:text-gray-700"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {pending && (
                <div className="space-y-3 py-12 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
                  <p className="text-xs text-gray-500">Fetching tracking updates...</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {tracking && <ShipmentTimeline tracking={tracking} />}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setOpen(false)} className={btnSecondary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
