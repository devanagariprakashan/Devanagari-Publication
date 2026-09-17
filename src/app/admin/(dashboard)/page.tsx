import Link from "next/link";
import {
  BookOpen,
  ShoppingCart,
  IndianRupee,
  MessageSquare,
  TicketPercent,
  Folder,
  Megaphone,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { card, tableTd, tableTh } from "@/components/admin/ui";

const SECONDARY_STATS = [
  { label: "Categories", table: "categories", icon: Folder },
  { label: "Coupons", table: "coupons", icon: TicketPercent },
  { label: "Announcements", table: "announcements", icon: Megaphone },
] as const;

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-amber-50 text-amber-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function money(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [ordersRes, unreadInquiriesRes, booksCountRes, secondaryCounts] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total_amount, order_status, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "unread"),
    supabase.from("books").select("id", { count: "exact", head: true }),
    Promise.all(
      SECONDARY_STATS.map(async (def) => {
        const { count } = await supabase.from(def.table).select("id", { count: "exact", head: true });
        return { ...def, value: count ?? 0 };
      }),
    ),
  ]);

  const orders = ordersRes.data ?? [];
  const totalBooks = booksCountRes.count ?? 0;
  const unreadInquiries = unreadInquiriesRes.count ?? 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const liveOrders = orders.filter((o) => o.order_status !== "cancelled");
  const totalRevenue = liveOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const monthRevenue = liveOrders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.order_status === "pending" || o.order_status === "confirmed").length;

  const latestOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-stone-900">Overview</h2>

      {/* Primary KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <IndianRupee className="h-4 w-4" />
            Total Revenue
          </div>
          <p className="mt-2 text-3xl font-bold text-stone-900">{money(totalRevenue)}</p>
          <p className="mt-1 text-xs text-stone-400">{money(monthRevenue)} this month</p>
        </div>
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <ShoppingCart className="h-4 w-4" />
            Total Orders
          </div>
          <p className="mt-2 text-3xl font-bold text-stone-900">{orders.length}</p>
          <p className="mt-1 text-xs text-stone-400">{pendingOrders} awaiting action</p>
        </div>
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <BookOpen className="h-4 w-4" />
            Total Books
          </div>
          <p className="mt-2 text-3xl font-bold text-stone-900">{totalBooks}</p>
          <p className="mt-1 text-xs text-stone-400">Live in catalog</p>
        </div>
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <MessageSquare className="h-4 w-4" />
            Inquiries
          </div>
          <p className="mt-2 text-3xl font-bold text-stone-900">{unreadInquiries}</p>
          <p className="mt-1 text-xs text-stone-400">Unread, needs a reply</p>
        </div>
      </div>

      {/* Latest orders table */}
      <div className={card}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-stone-900">Latest Orders</h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
                  <td className={tableTd} colSpan={5}>No orders yet.</td>
                </tr>
              ) : (
                latestOrders.map((o) => (
                  <tr key={o.id}>
                    <td className={tableTd}>{o.order_number}</td>
                    <td className={tableTd}>{o.customer_name ?? "—"}</td>
                    <td className={tableTd}>{money(Number(o.total_amount))}</td>
                    <td className={tableTd}>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${ORDER_STATUS_STYLES[o.order_status] ?? "bg-gray-100 text-gray-600"}`}>
                        {ORDER_STATUS_LABELS[o.order_status] ?? o.order_status}
                      </span>
                    </td>
                    <td className={tableTd + " flex items-center gap-1.5 text-stone-500"}>
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary counts */}
      <div className="grid gap-4 sm:grid-cols-3">
        {secondaryCounts.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={card + " p-5"}>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Icon className="h-4 w-4" />
                {stat.label}
              </div>
              <p className="mt-1.5 text-2xl font-bold text-stone-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
