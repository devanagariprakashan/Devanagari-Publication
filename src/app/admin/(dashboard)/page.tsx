import Link from "next/link";
import {
  BookOpen,
  ShoppingCart,
  IndianRupee,
  MessageSquare,
  TicketPercent,
  Folder,
  Megaphone,
  Users,
  Plus,
  Truck,
  PackageX,
  LayoutTemplate,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { btnPrimary, btnSecondary, card, tableTd, tableTh } from "@/components/admin/ui";
import { SalesChart, type SalesDay } from "@/components/admin/DashboardCharts";

const SECONDARY_STATS = [
  { label: "Categories", table: "categories", icon: Folder, href: "/admin/categories", tone: "bg-emerald-100 text-emerald-700" },
  { label: "Coupons", table: "coupons", icon: TicketPercent, href: "/admin/coupons", tone: "bg-violet-100 text-violet-700" },
  { label: "Announcements", table: "announcements", icon: Megaphone, href: "/admin/announcements", tone: "bg-amber-100 text-amber-700" },
] as const;

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-amber-50 text-amber-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  payment_failed: "bg-red-50 text-red-700",
};

const STATUS_BAR: Record<string, string> = {
  pending: "bg-gray-400",
  confirmed: "bg-blue-500",
  shipped: "bg-amber-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-400",
  payment_failed: "bg-red-400",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment failed",
};

const RANGES = [7, 14, 30];

function money(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function IconTile({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>{children}</div>;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function lastDays(count: number, now: Date) {
  return Array.from({ length: count }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (count - 1 - i)));
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const rangeDays = RANGES.includes(Number(range)) ? Number(range) : 7;
  const supabase = await createClient();

  const [ordersRes, unreadInquiriesRes, booksRes, outOfStockRes, toShipRes, secondaryCounts, itemsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_email, total_amount, order_status, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "unread"),
    supabase.from("books").select("created_at"),
    supabase.from("books").select("id", { count: "exact", head: true }).eq("in_stock", false),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("order_status", ["pending", "confirmed"])
      .neq("shipment_status", "created"),
    Promise.all(
      SECONDARY_STATS.map(async (def) => {
        const { count } = await supabase.from(def.table).select("id", { count: "exact", head: true });
        return { ...def, value: count ?? 0 };
      }),
    ),
    supabase.from("order_items").select("product_name, quantity, orders(order_status)"),
  ]);

  const orders = ordersRes.data ?? [];
  const books = booksRes.data ?? [];
  const totalBooks = books.length;
  const unreadInquiries = unreadInquiriesRes.count ?? 0;
  const outOfStock = outOfStockRes.count ?? 0;
  const toShip = toShipRes.count ?? 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const liveOrders = orders.filter((o) => o.order_status !== "cancelled" && o.order_status !== "payment_failed");
  const totalRevenue = liveOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const monthRevenue = liveOrders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const lastMonthRevenue = liveOrders
    .filter((o) => {
      const d = new Date(o.created_at);
      return d >= startOfLastMonth && d < startOfMonth;
    })
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const monthChange = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : monthRevenue > 0 ? 100 : 0;

  const firstOrderByCustomer = new Map<string, Date>();
  for (const o of [...orders].reverse()) {
    const email = (o.customer_email ?? "").toLowerCase();
    if (email && !firstOrderByCustomer.has(email)) firstOrderByCustomer.set(email, new Date(o.created_at));
  }
  const customerCount = firstOrderByCustomer.size;

  // Per-day series for the sales chart.
  const revenueByDay = new Map<string, { revenue: number; orders: number }>();
  for (const o of liveOrders) {
    const key = dayKey(new Date(o.created_at));
    const entry = revenueByDay.get(key) ?? { revenue: 0, orders: 0 };
    entry.revenue += Number(o.total_amount);
    entry.orders += 1;
    revenueByDay.set(key, entry);
  }
  const salesDays: SalesDay[] = lastDays(rangeDays, now).map((date) => ({
    date,
    revenue: revenueByDay.get(dayKey(date))?.revenue ?? 0,
    orders: revenueByDay.get(dayKey(date))?.orders ?? 0,
  }));
  const rangeRevenue = salesDays.reduce((sum, d) => sum + d.revenue, 0);
  const rangeOrders = salesDays.reduce((sum, d) => sum + d.orders, 0);

  const statusCounts = new Map<string, number>();
  for (const o of orders) statusCounts.set(o.order_status, (statusCounts.get(o.order_status) ?? 0) + 1);
  const statusRows = ["pending", "confirmed", "shipped", "delivered", "cancelled", "payment_failed"]
    .map((status) => ({ status, count: statusCounts.get(status) ?? 0 }))
    .filter((row) => row.count > 0);

  type ItemRow = { product_name: string; quantity: number; orders: { order_status: string } | { order_status: string }[] | null };
  const unitsByBook = new Map<string, number>();
  for (const item of (itemsRes.data ?? []) as unknown as ItemRow[]) {
    const order = Array.isArray(item.orders) ? item.orders[0] : item.orders;
    if (!order || order.order_status === "cancelled" || order.order_status === "payment_failed") continue;
    unitsByBook.set(item.product_name, (unitsByBook.get(item.product_name) ?? 0) + (item.quantity || 1));
  }
  const topBooks = [...unitsByBook.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topMax = topBooks[0]?.[1] ?? 0;

  const latestOrders = orders.slice(0, 5);

  const kpis = [
    {
      label: "Total Revenue",
      value: money(totalRevenue),
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-600",
      href: "/admin/orders",
      sub: (
        <span className={`inline-flex items-center gap-0.5 font-medium ${monthChange < 0 ? "text-red-600" : "text-green-600"}`}>
          {monthChange < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          {monthChange >= 0 ? "+" : ""}
          {Math.round(monthChange)}% this month
        </span>
      ),
    },
    {
      label: "Orders",
      value: String(orders.length),
      icon: ShoppingCart,
      tone: "bg-blue-100 text-blue-600",
      href: "/admin/orders",
      sub: <span className="text-stone-400">All time</span>,
    },
    {
      label: "Customers",
      value: String(customerCount),
      icon: Users,
      tone: "bg-violet-100 text-violet-600",
      href: "/admin/customers",
      sub: <span className="text-stone-400">Have placed an order</span>,
    },
    {
      label: "Books",
      value: String(totalBooks),
      icon: BookOpen,
      tone: "bg-amber-100 text-amber-600",
      href: "/admin/books",
      sub: <span className="text-stone-400">In the catalog</span>,
    },
  ];

  const quickStats = [
    { href: "/admin/orders", icon: Truck, label: "Orders to ship", value: toShip, hint: "Confirmed, no shipment yet", tone: "bg-rose-100 text-rose-600" },
    { href: "/admin/books?stock=out", icon: PackageX, label: "Out of stock books", value: outOfStock, hint: "Customers can't order these", tone: "bg-amber-100 text-amber-600" },
    { href: "/admin/inquiries", icon: MessageSquare, label: "Unread inquiries", value: unreadInquiries, hint: "Waiting for a reply", tone: "bg-blue-100 text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-white to-white px-6 py-7 ring-1 ring-rose-100/70 sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-rose-100/60 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Dashboard</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">Welcome back, Admin</h2>
            <p className="mt-1.5 text-sm text-stone-500">Here&apos;s what&apos;s happening with your bookstore today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/books/new" className={btnPrimary}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Book
            </Link>
            <Link href="/admin/orders" className={btnSecondary}>
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              Orders
            </Link>
            <Link href="/admin/hero" className={btnSecondary}>
              <LayoutTemplate className="mr-1.5 h-4 w-4" />
              Edit Hero
            </Link>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href} className={card + " flex items-center gap-4 p-5 transition hover:shadow-md"}>
              <IconTile tone={kpi.tone}>
                <Icon className="h-5 w-5" />
              </IconTile>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-stone-500">{kpi.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-stone-900">{kpi.value}</p>
                <p className="mt-0.5 text-xs">{kpi.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Sales overview + quick stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className={card + " p-5 lg:col-span-2"}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-stone-900">Sales Overview</h3>
              <p className="mt-0.5 text-sm text-stone-500">
                <span className="font-semibold text-stone-900">{money(rangeRevenue)}</span> from {rangeOrders} order
                {rangeOrders === 1 ? "" : "s"} in the last {rangeDays} days
              </p>
            </div>
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 text-sm">
              {RANGES.map((days) => (
                <Link
                  key={days}
                  href={days === 7 ? "/admin" : `/admin?range=${days}`}
                  className={`rounded-md px-3 py-1 font-medium transition ${
                    rangeDays === days ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {days}d
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <SalesChart days={salesDays} />
          </div>
        </section>

        <section className={card + " p-5"}>
          <h3 className="text-base font-semibold text-stone-900">Quick Stats</h3>
          <div className="mt-4 space-y-3">
            {quickStats.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3.5 rounded-xl bg-stone-50 p-3.5 ring-1 ring-stone-100 transition hover:bg-stone-100"
                >
                  <IconTile tone={item.value > 0 ? item.tone : "bg-stone-100 text-stone-400"}>
                    <Icon className="h-5 w-5" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-600">{item.label}</p>
                    <p className="text-lg font-bold leading-tight text-stone-900">{item.value}</p>
                    <p className="text-xs text-stone-400">{item.value > 0 ? item.hint : "All clear"}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-300" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Latest orders + store content */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className={card + " lg:col-span-2"}>
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-base font-semibold text-stone-900">Latest Orders</h3>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border-t border-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className={tableTh}>Order #</th>
                  <th className={tableTh}>Customer</th>
                  <th className={tableTh}>Total</th>
                  <th className={tableTh}>Status</th>
                  <th className={tableTh}>Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestOrders.length === 0 ? (
                  <tr>
                    <td className={tableTd + " py-10 text-center"} colSpan={5}>
                      <p className="font-medium text-stone-900">No orders yet</p>
                      <p className="mt-1 text-xs text-stone-400">They will show up here as soon as a customer checks out.</p>
                    </td>
                  </tr>
                ) : (
                  latestOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className={tableTd + " font-mono text-xs font-semibold"}>
                        <Link href={`/admin/orders?q=${encodeURIComponent(o.order_number)}`} className="hover:underline">
                          {o.order_number}
                        </Link>
                      </td>
                      <td className={tableTd}>{o.customer_name ?? "—"}</td>
                      <td className={tableTd + " font-semibold"}>{money(Number(o.total_amount))}</td>
                      <td className={tableTd}>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            ORDER_STATUS_STYLES[o.order_status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[o.order_status] ?? o.order_status}
                        </span>
                      </td>
                      <td className={tableTd + " text-stone-500"}>
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={card + " p-5"}>
          <h3 className="text-base font-semibold text-stone-900">Store Content</h3>
          <div className="mt-4 space-y-2.5">
            {secondaryCounts.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="flex items-center gap-3.5 rounded-xl bg-stone-50 p-3 ring-1 ring-stone-100 transition hover:bg-stone-100"
                >
                  <IconTile tone={stat.tone}>
                    <Icon className="h-5 w-5" />
                  </IconTile>
                  <span className="flex-1 text-sm font-medium text-stone-700">{stat.label}</span>
                  <span className="text-base font-bold text-stone-900">{stat.value}</span>
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Status breakdown + top books */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={card + " p-5"}>
          <h3 className="text-base font-semibold text-stone-900">Orders by status</h3>
          <p className="mt-0.5 text-sm text-stone-500">{orders.length} order{orders.length === 1 ? "" : "s"} in total</p>
          {statusRows.length === 0 ? (
            <div className="mt-5 flex h-28 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-stone-400">
              No orders yet
            </div>
          ) : (
            <ul className="mt-5 space-y-3.5">
              {statusRows.map((row) => (
                <li key={row.status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-stone-600">{ORDER_STATUS_LABELS[row.status] ?? row.status}</span>
                    <span className="font-semibold text-stone-900">{row.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR[row.status] ?? "bg-gray-400"}`}
                      style={{ width: `${(row.count / orders.length) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card + " p-5"}>
          <h3 className="text-base font-semibold text-stone-900">Top selling books</h3>
          <p className="mt-0.5 text-sm text-stone-500">By copies sold</p>
          {topBooks.length === 0 ? (
            <div className="mt-5 flex h-28 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-stone-400">
              Sales will show up here
            </div>
          ) : (
            <ol className="mt-5 space-y-4">
              {topBooks.map(([name, units], index) => (
                <li key={name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-stone-500">
                        {index + 1}
                      </span>
                      <span className="truncate text-stone-700" title={name}>
                        {name}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-stone-900">{units}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${(units / topMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
