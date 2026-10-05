import { createClient } from "@/lib/supabase/server";
import { syncOrderStatusesFromIthink } from "@/lib/ithink-sync";
import { OrdersManager } from "@/components/admin/OrdersManager";
import type { Order } from "@/components/admin/OrdersManager";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  // Refresh statuses from iThink first (throttled to once every few minutes). A failure must never block the page.
  await syncOrderStatusesFromIthink().catch((error) => console.error("iThink status sync failed", error));
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, books(image_url))")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full">
      <OrdersManager orders={(orders as Order[]) ?? []} initialQuery={q} />
    </div>
  );
}
