import { createClient } from "@/lib/supabase/server";

const statDefs = [
  { label: "Total Books", table: "books" },
  { label: "Total Orders", table: "orders" },
  { label: "Inquiries", table: "inquiries" },
  { label: "Categories", table: "categories" },
  { label: "Announcements", table: "announcements" },
] as const;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    statDefs.map(async (def) => {
      const { count } = await supabase
        .from(def.table)
        .select("id", { count: "exact", head: true });
      return { label: def.label, value: count ?? 0 };
    }),
  );

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-stone-900">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-6"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
