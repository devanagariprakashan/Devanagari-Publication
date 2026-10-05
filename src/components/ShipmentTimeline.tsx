import { Fragment } from "react";
import { AlertTriangle, Calendar, CheckCircle2, MapPin, Navigation, Package, PackageCheck, Truck } from "lucide-react";
import type { ShipmentTracking } from "@/lib/ithink";

const STAGES = [
  { label: "Booked", icon: Package },
  { label: "Picked up", icon: PackageCheck },
  { label: "In transit", icon: Truck },
  { label: "Out for delivery", icon: Navigation },
  { label: "Delivered", icon: CheckCircle2 },
] as const;

// iThink gives free-text courier statuses, so the stage is inferred from keywords.
function stageOf(status: string): { stage: number; exception: boolean } {
  const s = status.toLowerCase();
  // Exceptions stop the progress bar where the problem happened: a cancelled shipment never left "Booked".
  if (/cancel/.test(s)) return { stage: 0, exception: true };
  if (/undeliver|not delivered|delivery failed|attempt/.test(s)) return { stage: 3, exception: true };
  if (/rto|return|lost|damag|failed/.test(s)) return { stage: 2, exception: true };
  if (/out for delivery|ofd/.test(s)) return { stage: 3, exception: false };
  if (/deliver/.test(s)) return { stage: 4, exception: false };
  if (/transit|reached|arrived|hub|dispatch|shipped|forward|depart|bagged|connected/.test(s)) return { stage: 2, exception: false };
  if (/pending|scheduled|awaiting|not picked|manifest|created|booked/.test(s)) return { stage: 0, exception: false };
  if (/pick/.test(s)) return { stage: 1, exception: false };
  return { stage: 0, exception: false };
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatWhen(value: string) {
  const date = parseDate(value);
  if (!date) return { day: value, time: "" };
  return {
    day: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function ShipmentTimeline({ tracking }: { tracking: ShipmentTracking }) {
  const { stage, exception } = stageOf(tracking.currentStatus);
  const delivered = stage === 4 && !exception;

  // Newest scan first, unless the dates can't be read — then keep iThink's order.
  // Before pickup iThink returns no scan list, only the current status — show that as the first timeline entry.
  const history =
    tracking.history.length > 0
      ? tracking.history
      : tracking.currentStatus && tracking.currentStatus !== "Unknown"
        ? [{ status: tracking.currentStatus, location: tracking.lastLocation ?? "", dateTime: tracking.lastUpdate ?? "" }]
        : [];
  const dated = history.map((scan) => ({ scan, time: parseDate(scan.dateTime)?.getTime() ?? null }));
  const sortable = dated.length > 1 && dated.every((d) => d.time !== null);
  const scans = sortable ? [...dated].sort((a, b) => (b.time as number) - (a.time as number)) : dated;

  return (
    <div className="space-y-6">
      {/* Current status */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 ring-1 ${
          exception
            ? "bg-gradient-to-br from-amber-50 to-white ring-amber-200"
            : "bg-gradient-to-br from-rose-50 via-white to-white ring-rose-100"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Current status</p>
            <p className="mt-0.5 flex items-center gap-2 text-lg font-bold text-gray-900">
              {exception && <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />}
              {tracking.currentStatus}
            </p>
          </div>
          {tracking.courier && (
            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200">
              {tracking.courier}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1.5 text-xs text-gray-600">
          {tracking.expectedDeliveryDate && !delivered && (
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              Expected delivery <strong className="text-gray-900">{tracking.expectedDeliveryDate}</strong>
            </p>
          )}
          {tracking.lastLocation && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span>
                {tracking.lastLocation}
                {tracking.lastUpdate && <span className="text-gray-400"> · {formatWhen(tracking.lastUpdate).day} {formatWhen(tracking.lastUpdate).time}</span>}
              </span>
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="mt-5 flex items-start">
          {STAGES.map((step, i) => {
            const Icon = step.icon;
            const done = i < stage || delivered;
            const current = i === stage && !delivered;
            return (
              <Fragment key={step.label}>
                {i > 0 && <div className={`mt-4 h-0.5 flex-1 rounded-full ${i <= stage ? "bg-[#C61821]" : "bg-gray-200"}`} />}
                <div className="flex w-14 shrink-0 flex-col items-center gap-1.5 text-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      done
                        ? "bg-[#C61821] text-white"
                        : current
                          ? `${exception ? "bg-amber-500" : "bg-[#C61821]"} text-white ring-4 ${exception ? "ring-amber-500/20" : "ring-[#C61821]/20"}`
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-semibold leading-tight ${done || current ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Scan history */}
      <div>
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Shipment journey
        </h4>

        {scans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center">
            <Package className="mx-auto h-6 w-6 text-gray-300" />
            <p className="mt-2 text-sm font-semibold text-gray-700">Waiting for the first scan</p>
            <p className="mx-auto mt-0.5 max-w-xs text-xs text-gray-500">
              The shipment is booked. Scans appear here as soon as the courier picks up the parcel.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-1 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-0.5 before:rounded-full before:bg-gray-200">
            {scans.map(({ scan }, idx) => {
              const latest = idx === 0;
              const info = stageOf(scan.status);
              const Icon = info.exception ? AlertTriangle : STAGES[info.stage].icon;
              const when = formatWhen(scan.dateTime);
              return (
                <li key={idx} className={`relative flex gap-3 rounded-xl p-2 ${latest ? "bg-rose-50/70" : ""}`}>
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                      latest
                        ? info.exception
                          ? "bg-amber-500 text-white"
                          : "bg-[#C61821] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className={`text-sm first-letter:uppercase ${latest ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>{scan.status}</p>
                      <p className="whitespace-nowrap text-[11px] text-gray-400">
                        {when.day}
                        {when.time && ` · ${when.time}`}
                      </p>
                    </div>
                    {scan.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                        {scan.location}
                      </p>
                    )}
                    {scan.remark && <p className="mt-0.5 text-xs text-gray-400">{scan.remark}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
