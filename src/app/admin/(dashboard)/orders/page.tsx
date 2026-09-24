import { createClient } from "@/lib/supabase/server";
import { OrdersManager } from "@/components/admin/OrdersManager";
import type { Order } from "@/components/admin/OrdersManager";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, books(image_url))")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full">
      <OrdersManager orders={(orders as Order[]) ?? []} />
    </div>
  );
}
