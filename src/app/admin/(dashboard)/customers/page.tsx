import { createClient } from "@/lib/supabase/server";
import { btnSecondary, card, inputCls, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, StatCards } from "@/components/admin/PageHeader";
import { IndianRupee, Repeat, Search, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

type SearchParams = Promise<{ q?: string }>;

type Customer = {
  email: string;
  name: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  lastOrder: string;
};

function money(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

// Customers aren't a separate table — checkout is guest-based — so they are derived from orders by email.
export default async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_name, customer_email, customer_phone, city, total_amount, order_status, created_at")
    .order("created_at", { ascending: false });

  const byEmail = new Map<string, Customer>();
  for (const o of orders ?? []) {
    const email = (o.customer_email ?? "").toLowerCase();
    if (!email) continue;
    const counts = o.order_status !== "cancelled" && o.order_status !== "payment_failed";
    const existing = byEmail.get(email);
    if (existing) {
      existing.orders += 1;
      if (counts) existing.spent += Number(o.total_amount) || 0;
    } else {
      byEmail.set(email, {
        email,
        name: o.customer_name ?? "—",
        phone: o.customer_phone ?? "—",
        city: o.city ?? "—",
        orders: 1,
        spent: counts ? Number(o.total_amount) || 0 : 0,
        lastOrder: o.created_at,
      });
    }
  }

  const all = [...byEmail.values()];
  const repeat = all.filter((c) => c.orders > 1).length;
  const totalSpent = all.reduce((sum, c) => sum + c.spent, 0);

  const term = q.trim().toLowerCase();
  const customers = all
    .filter((c) => !term || [c.name, c.email, c.phone, c.city].some((v) => v.toLowerCase().includes(term)))
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Everyone who has placed an order, grouped by email. Cancelled and failed orders don't count towards spend."
      />

      <StatCards
        id="customers"
        items={[
          { label: "Total Customers", value: all.length, icon: Users, tone: "rose", sub: "All time" },
          { label: "Repeat Customers", value: repeat, icon: Repeat, tone: "blue", sub: all.length ? `${Math.round((repeat / all.length) * 100)}% of customers` : "0%" },
          { label: "Total Spend", value: money(totalSpent), icon: IndianRupee, tone: "emerald", sub: "Excl. cancelled & failed" },
          { label: "Avg. per Customer", value: money(all.length ? totalSpent / all.length : 0), icon: TrendingUp, tone: "violet", sub: "Lifetime value" },
        ]}
      />

      <form method="get" className={card + " flex flex-wrap items-center gap-3 p-4"}>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={q} placeholder="Search name, email, phone or city" className={inputCls + " pl-9"} />
        </div>
        <button type="submit" className={btnSecondary}>
          Search
        </button>
        {term && (
          <Link href="/admin/customers" className="text-sm font-medium text-gray-500 hover:text-gray-800">
            Clear
          </Link>
        )}
        <span className="ml-auto text-sm text-gray-500">
          {customers.length} customer{customers.length === 1 ? "" : "s"}
        </span>
      </form>

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className={tableTh}>Customer</th>
                <th className={tableTh}>Phone</th>
                <th className={tableTh}>City</th>
                <th className={tableTh}>Orders</th>
                <th className={tableTh}>Total Spent</th>
                <th className={tableTh}>Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.email} className="transition hover:bg-rose-50/40">
                  <td className={tableTd}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold uppercase text-rose-600">
                        {(c.name.trim()[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={tableTd}>{c.phone}</td>
                  <td className={tableTd}>{c.city}</td>
                  <td className={tableTd}>
                    <Link href={`/admin/orders?q=${encodeURIComponent(c.email)}`} className="font-medium text-brand-600 hover:underline">
                      {c.orders}
                    </Link>
                  </td>
                  <td className={tableTd + " font-semibold"}>{money(c.spent)}</td>
                  <td className={tableTd}>
                    {new Date(c.lastOrder).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <EmptyRow
                  colSpan={6}
                  icon={Users}
                  title={term ? "No customers found" : "No customers yet"}
                  hint={term ? "No customers match this search." : "Customers appear here once they place an order."}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
