import type { ComponentType, ReactNode } from "react";
import { card, pageTitle } from "./ui";
import { Sparkline } from "./DashboardCharts";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-white px-6 py-6 ring-1 ring-rose-100/70">
      <div className="pointer-events-none absolute -right-8 -top-14 h-48 w-48 rounded-full bg-rose-100/60 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={pageTitle}>{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>}
        </div>
        {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}

export function SectionCardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5 border-b border-gray-100 pb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

export function EmptyRow({
  colSpan,
  title,
  hint,
  icon: Icon,
}: {
  colSpan: number;
  title: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-14 text-center">
        {Icon && (
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-400 ring-1 ring-rose-100">
            <Icon className="h-7 w-7" />
          </div>
        )}
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {hint && <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">{hint}</p>}
      </td>
    </tr>
  );
}

const PILL_TONES = {
  green: "bg-green-50 text-green-700 ring-green-600/15",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
  gray: "bg-gray-100 text-gray-600 ring-gray-500/15",
} as const;

export function Pill({ tone = "gray", children }: { tone?: keyof typeof PILL_TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PILL_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const STAT_TONES = {
  rose: { bg: "from-rose-50", tile: "bg-rose-100 text-rose-600", color: "#e11d48" },
  blue: { bg: "from-blue-50", tile: "bg-blue-100 text-blue-600", color: "#3b82f6" },
  amber: { bg: "from-amber-50", tile: "bg-amber-100 text-amber-600", color: "#f59e0b" },
  emerald: { bg: "from-emerald-50", tile: "bg-emerald-100 text-emerald-600", color: "#10b981" },
  violet: { bg: "from-violet-50", tile: "bg-violet-100 text-violet-600", color: "#8b5cf6" },
} as const;

export type StatTone = keyof typeof STAT_TONES;

export type StatItem = {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  tone: StatTone;
  sub?: ReactNode;
  spark?: number[];
};

/** Row of tinted KPI cards (same look as the Orders / Dashboard pages). */
export function StatCards({ items, id }: { items: StatItem[]; id: string }) {
  const cols =
    items.length >= 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      : items.length === 4
        ? "grid-cols-2 lg:grid-cols-4"
        : items.length === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2";
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((item, index) => {
        const tone = STAT_TONES[item.tone];
        const Icon = item.icon;
        return (
          <div key={item.label} className={`${card} bg-gradient-to-br ${tone.bg} to-white p-4`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.tile}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="truncate text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
            {(item.sub || item.spark) && (
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-xs text-gray-400">{item.sub}</p>
                {item.spark && <Sparkline values={item.spark} color={tone.color} id={`${id}-${index}`} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
