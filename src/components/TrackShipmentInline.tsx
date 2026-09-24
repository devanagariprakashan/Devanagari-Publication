"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, MapPin, X } from "lucide-react";
import { trackShipmentAction } from "@/actions/shipments";
import type { ShipmentTracking } from "@/lib/ithink";

export default function TrackShipmentInline({ awb }: { awb: string }) {
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
        className="inline-flex items-center gap-1 mt-1.5 text-[#C61821] font-bold hover:underline cursor-pointer"
      >
        Track on iThink Logistics →
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
              <h3 className="text-base font-bold text-gray-900">Shipment Tracking</h3>
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

            {tracking && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FBFBFC]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">AWB {tracking.awb}</p>
                  <p className="mt-1 text-base font-bold text-gray-900">{tracking.currentStatus}</p>
                  {tracking.courier && <p className="text-xs text-gray-500">Courier: {tracking.courier}</p>}
                  {tracking.expectedDeliveryDate && (
                    <p className="text-xs text-gray-500">Expected delivery: {tracking.expectedDeliveryDate}</p>
                  )}
                  {tracking.lastLocation && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {tracking.lastLocation}
                      {tracking.lastUpdate && <span className="text-gray-400">· {tracking.lastUpdate}</span>}
                    </p>
                  )}
                </div>

                {tracking.history.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">History</h4>
                    <div className="space-y-3 pl-1">
                      {tracking.history.map((scan, idx) => (
                        <div key={idx} className="flex gap-2.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C61821]" />
                          <div>
                            <p className="text-xs font-bold text-gray-900">{scan.status}</p>
                            <p className="text-[11px] text-gray-500">{scan.location} · {scan.dateTime}</p>
                            {scan.remark && <p className="text-[11px] text-gray-400">{scan.remark}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
