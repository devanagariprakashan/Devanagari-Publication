"use client";

import { useState, useTransition } from "react";
import { Route, X } from "lucide-react";
import { trackShipmentAction } from "@/actions/shipments";
import ShipmentTimeline from "@/components/ShipmentTimeline";
import type { ShipmentTracking } from "@/lib/ithink";

export default function TrackShipmentInline({ awb, variant = "link" }: { awb: string; variant?: "link" | "button" }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <button
        type="button"
        onClick={load}
        className={
          variant === "button"
            ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#C61821]/30 bg-[#FFF3F3] text-xs font-bold text-[#C61821] hover:bg-[#C61821] hover:text-white transition-all cursor-pointer"
            : "inline-flex items-center gap-1.5 mt-1.5 text-[#C61821] font-bold hover:underline cursor-pointer"
        }
      >
        <Route className="w-3.5 h-3.5" />
        {variant === "button" ? "Track Order" : "Track on iThink Logistics"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Shipment Tracking</h3>
                <p className="font-mono text-[11px] text-gray-500">AWB {awb}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pending && <p className="text-sm text-gray-500">Fetching latest status...</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            {tracking && <ShipmentTimeline tracking={tracking} />}
          </div>
        </div>
      )}
    </>
  );
}
