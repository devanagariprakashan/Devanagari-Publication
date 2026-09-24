"use client";

import { useState, useTransition } from "react";
import {
  ExternalLink,
  X,
  MapPin,
  Calendar,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { trackShipmentAction } from "@/actions/shipments";
import type { ShipmentTracking } from "@/lib/ithink";
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

              {tracking && (
                <div className="space-y-5">
                  <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Current Status
                      </span>
                      {tracking.courier && (
                        <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700">
                          {tracking.courier}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-gray-900">{tracking.currentStatus}</p>

                    {tracking.expectedDeliveryDate && (
                      <p className="flex items-center gap-1.5 pt-1 text-xs text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        Estimated delivery: <strong className="text-gray-900">{tracking.expectedDeliveryDate}</strong>
                      </p>
                    )}

                    {tracking.lastLocation && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {tracking.lastLocation}
                        {tracking.lastUpdate && (
                          <span className="text-xs text-gray-400">· {tracking.lastUpdate}</span>
                        )}
                      </p>
                    )}
                  </div>

                  {tracking.history && tracking.history.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Scan History ({tracking.history.length})
                      </h4>
                      <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-gray-200">
                        {tracking.history.map((scan, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-gray-400" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-semibold text-gray-900">{scan.status}</p>
                              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                                {scan.location}
                                {scan.dateTime && <span>· {scan.dateTime}</span>}
                              </p>
                              {scan.remark && (
                                <p className="text-xs italic text-gray-400">{scan.remark}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
