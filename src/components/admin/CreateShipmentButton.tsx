"use client";

import { useState, useTransition, useMemo } from "react";
import { Truck, X, Search, Check, CheckCircle2, AlertCircle, Clock, Box } from "lucide-react";
import { createShipmentAction, checkRatesAction } from "@/actions/shipments";
import type { CourierRate } from "@/lib/ithink";
import { btnPrimary, btnSecondary } from "./ui";

const PRESETS = [
  { label: "1 Book", length: "22", width: "15", height: "3", weight: "0.4" },
  { label: "2-3 Books", length: "25", width: "18", height: "6", weight: "0.9" },
  { label: "Bulk Bundle", length: "30", width: "22", height: "10", weight: "1.8" },
];

function getCourierBrand(name: string) {
  const n = name.toLowerCase();
  if (n.includes("bluedart") || n.includes("blue dart")) {
    return { code: "BD", accent: "bg-blue-600" };
  }
  if (n.includes("delhivery")) {
    return { code: "DL", accent: "bg-red-600" };
  }
  if (n.includes("shadowfax")) {
    return { code: "SF", accent: "bg-teal-600" };
  }
  if (n.includes("dtdc")) {
    return { code: "DT", accent: "bg-indigo-600" };
  }
  if (n.includes("xpressbees")) {
    return { code: "XB", accent: "bg-amber-600" };
  }
  return { code: name.slice(0, 2).toUpperCase(), accent: "bg-gray-600" };
}

export function CreateShipmentButton({
  orderId,
  shipmentStatus,
  isExpress = false,
}: {
  orderId: string;
  shipmentStatus: string | null;
  isExpress?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [ratesPending, startRatesTransition] = useTransition();
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

  const [dims, setDims] = useState({ length: "22", width: "15", height: "3", weight: "0.5" });
  const [rates, setRates] = useState<CourierRate[] | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (shipmentStatus === "created") return null;

  const lowestRate = useMemo(() => {
    if (!rates || rates.length === 0) return null;
    return Math.min(...rates.map((r) => r.rate));
  }, [rates]);

  // Only meaningful when couriers actually differ in TAT — if every courier reports the same
  // number of days (common for a single pincode/zone), there is no "fastest" to call out.
  const fastestTat = useMemo(() => {
    if (!rates || rates.length === 0) return null;
    const tats = rates
      .map((r) => (r.deliveryTat ? parseFloat(r.deliveryTat) : NaN))
      .filter((n) => !Number.isNaN(n));
    if (tats.length === 0) return null;
    const min = Math.min(...tats);
    const hasVariation = tats.some((t) => t !== min);
    return hasVariation ? min : null;
  }, [rates]);

  const selectedRate = selectedIndex !== null ? rates?.[selectedIndex] ?? null : null;

  // For a customer who paid for Express delivery, default the pick to whichever courier reports
  // the lowest TAT instead of the cheapest one — cheapest-first only makes sense for standard orders.
  const pickBestIndex = (allRates: CourierRate[]): number | null => {
    if (allRates.length === 0) return null;
    if (!isExpress) return 0;
    let best = allRates[0];
    for (const r of allRates) {
      const bestTat = best.deliveryTat ? parseFloat(best.deliveryTat) : Infinity;
      const rTat = r.deliveryTat ? parseFloat(r.deliveryTat) : Infinity;
      if (rTat < bestTat || (rTat === bestTat && r.rate < best.rate)) best = r;
    }
    return allRates.indexOf(best);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.set("length", dims.length);
    fd.set("width", dims.width);
    fd.set("height", dims.height);
    fd.set("weight", dims.weight);
    fd.set("courier", selectedRate?.courier.toLowerCase() ?? "");
    fd.set("serviceType", selectedRate?.serviceType ?? "");
    return fd;
  };

  const handleCheckRates = () => {
    setRatesError(null);
    setRates(null);
    setSelectedIndex(null);
    startRatesTransition(async () => {
      const result = await checkRatesAction(orderId, buildFormData());
      if ("error" in result) {
        setRatesError(result.error);
      } else {
        setRates(result.rates);
        setSelectedIndex(pickBestIndex(result.rates));
      }
    });
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setDims({
      length: preset.length,
      width: preset.width,
      height: preset.height,
      weight: preset.weight,
    });
  };

  const handleSubmit = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await createShipmentAction(orderId, buildFormData());
      if ("error" in result) {
        setMessage({ error: result.error });
      } else {
        setMessage({ success: `Shipment created — AWB ${result.waybill ?? "assigned"}.` });
        setTimeout(() => setOpen(false), 1600);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMessage(null);
          setRates(null);
          setSelectedIndex(null);
        }}
        className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
      >
        <Truck className="h-3.5 w-3.5" />
        <span>{shipmentStatus === "failed" ? "Retry Shipment" : "Create Shipment"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  Create Shipment
                  {isExpress && (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      Express order
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500">
                  {isExpress
                    ? "Customer paid for Express delivery — the fastest courier is pre-selected."
                    : "Compare courier rates and generate an AWB via iThink Logistics."}
                </p>
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
              {message?.error && (
                <div className="flex items-center gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{message.error}</span>
                </div>
              )}
              {message?.success && (
                <div className="flex items-center gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{message.success}</span>
                </div>
              )}

              {/* Package dimensions */}
              <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Box className="h-3.5 w-3.5" />
                    Package Dimensions & Weight
                  </span>

                  <div className="flex items-center gap-1.5">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="rounded border border-gray-300 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 hover:border-brand-400 hover:text-brand-600"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {/* Length */}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-600">Length</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={dims.length}
                        onChange={(e) => setDims((d) => ({ ...d, length: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        cm
                      </span>
                    </div>
                  </div>

                  {/* Width */}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-600">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={dims.width}
                        onChange={(e) => setDims((d) => ({ ...d, width: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        cm
                      </span>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-600">Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={dims.height}
                        onChange={(e) => setDims((d) => ({ ...d, height: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        cm
                      </span>
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-gray-600">Weight</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={dims.weight}
                        onChange={(e) => setDims((d) => ({ ...d, weight: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate checker */}
              <button
                type="button"
                onClick={handleCheckRates}
                disabled={ratesPending}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-gray-50 py-2.5 text-xs font-medium text-gray-700 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-60"
              >
                <Search className={`h-4 w-4 ${ratesPending ? "animate-spin" : ""}`} />
                {ratesPending ? "Checking rates..." : rates ? "Refresh Rates" : "Check Courier Rates"}
              </button>

              {ratesError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {ratesError}
                </div>
              )}

              {/* Rate list */}
              {rates && rates.length > 0 && (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-xs font-semibold text-gray-700">
                      Available Couriers ({rates.length})
                    </span>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Days = estimated delivery time. Zone = iThink&apos;s distance-based pricing zone for this
                      route — not something you need to change.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {rates.map((r, originalIdx) => {
                      const isSelected = selectedIndex === originalIdx;
                      const isBestValue = r.rate === lowestRate;
                      const isFastest =
                        fastestTat !== null && r.deliveryTat !== null && parseFloat(r.deliveryTat) === fastestTat;
                      const brand = getCourierBrand(r.courier);

                      return (
                        <label
                          key={`${r.courier}-${r.serviceType ?? "default"}`}
                          className={`flex cursor-pointer items-center justify-between rounded-md border p-3 transition select-none ${
                            isSelected
                              ? "border-brand-500 bg-brand-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="courier-pick"
                              checked={isSelected}
                              onChange={() => setSelectedIndex(originalIdx)}
                              className="sr-only"
                            />

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${brand.accent} text-xs font-semibold text-white`}
                            >
                              {brand.code}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-900">{r.courier}</span>
                                {isBestValue && (
                                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                                    Lowest Rate
                                  </span>
                                )}
                                {isFastest && !isBestValue && (
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-800">
                                    Fastest
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                                {r.deliveryTat && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    ~{r.deliveryTat} days
                                  </span>
                                )}
                                {r.zone && (
                                  <span
                                    className="cursor-help"
                                    title="Shipping zone iThink uses to price this route — set by the courier network, not something you need to act on."
                                  >
                                    · Zone {r.zone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div>
                              <span className="text-sm font-semibold text-gray-900">
                                ₹{r.rate.toFixed(0)}
                              </span>
                              <span className="block text-[10px] text-gray-400">Incl. GST</span>
                            </div>

                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-brand-600 bg-brand-600 text-white"
                                  : "border-gray-300 bg-white text-transparent"
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {rates && rates.length === 0 && !ratesError && (
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
                  No couriers currently service this pincode for this weight and payment method.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <div className="text-xs">
                {selectedRate ? (
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400">Selected</span>
                    <span className="font-semibold text-gray-900">
                      {selectedRate.courier} · ₹{selectedRate.rate.toFixed(0)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Select a courier to continue</span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={pending}
                  className={btnPrimary}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {pending
                    ? "Generating AWB..."
                    : selectedRate
                      ? `Dispatch via ${selectedRate.courier}`
                      : "Create Shipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
