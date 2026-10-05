// Server-rendered SVG/HTML charts for the admin dashboard — no chart library needed.

function money(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function Sparkline({ values, color, id }: { values: number[]; color: string; id: string }) {
  const max = Math.max(...values, 0);
  const n = values.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => (max === 0 ? 28 : 28 - (v / max) * 24);
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const area = `${line} L100,30 L0,30 Z`;
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-9 w-24 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Round the axis maximum up to a "nice" number so the gridlines read as 0 / 100 / 200 instead of 0 / 137 / 274.
function niceMax(value: number) {
  if (value <= 0) return 400;
  const exponent = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / exponent;
  const step = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return step * exponent;
}

export type SalesDay = { date: Date; revenue: number; orders: number };

export function SalesChart({ days }: { days: SalesDay[] }) {
  const peak = Math.max(...days.map((d) => d.revenue), 0);
  const top = niceMax(peak);
  const ticks = [4, 3, 2, 1, 0].map((i) => (top / 4) * i);
  const n = days.length;
  const px = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const py = (v: number) => 100 - (v / top) * 100;
  const line = days.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(2)},${py(d.revenue).toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const labelEvery = n <= 7 ? 1 : n <= 14 ? 2 : 5;
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div>
      <div className="flex gap-3">
        <div className="relative h-56 w-12 shrink-0 text-right text-[11px] text-stone-400">
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${py(tick)}%` }}>
              {money(tick)}
            </span>
          ))}
        </div>

        <div className="relative h-56 flex-1">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C61821" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#C61821" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((tick) => (
              <line
                key={tick}
                x1="0"
                x2="100"
                y1={py(tick)}
                y2={py(tick)}
                stroke="#e7e5e4"
                strokeWidth="1"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {peak > 0 && <path d={area} fill="url(#sales-area)" />}
            <path
              d={line}
              fill="none"
              stroke="#C61821"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {days.map((day, i) => (
            <div
              key={i}
              className="group absolute inset-y-0"
              style={{ left: `${px(i) - 50 / Math.max(n - 1, 1)}%`, width: `${100 / Math.max(n - 1, 1)}%` }}
              role="img"
              aria-label={`${fmt(day.date)}: ${money(day.revenue)} from ${day.orders} order${day.orders === 1 ? "" : "s"}`}
            >
              <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-stone-300 group-hover:block" />
              <span
                className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 ring-2 ring-white"
                style={{ top: `${py(day.revenue)}%`, opacity: day.revenue > 0 ? 1 : 0.35 }}
              />
              <div
                className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-stone-900 px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block"
                style={{ top: `calc(${py(day.revenue)}% - 10px)` }}
              >
                <span className="block text-stone-300">{fmt(day.date)}</span>
                <span className="font-semibold">{money(day.revenue)}</span>
                <span className="text-stone-400"> · {day.orders} order{day.orders === 1 ? "" : "s"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative ml-[3.75rem] mt-2 h-4 text-[11px] text-stone-400">
        {days.map((day, i) =>
          i % labelEvery === 0 ? (
            <span key={i} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${px(i)}%` }}>
              {fmt(day.date)}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
