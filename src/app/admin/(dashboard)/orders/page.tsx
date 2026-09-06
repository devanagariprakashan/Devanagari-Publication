import { createClient } from "@/lib/supabase/server";
import { deleteOrder, updateOrderStatus } from "@/actions/orders";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Orders</h1>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Order #</th>
                <th className={tableTh}>Customer</th>
                <th className={tableTh}>Email</th>
                <th className={tableTh}>Total</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Created</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(orders ?? []).map((o) => (
                <tr key={o.id}>
                  <td className={tableTd}>{o.order_number}</td>
                  <td className={tableTd}>{o.customer_name ?? "—"}</td>
                  <td className={tableTd}>{o.customer_email ?? "—"}</td>
                  <td className={tableTd}>₹{o.total_amount}</td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={o.id}
                      value={o.order_status}
                      options={STATUSES}
                      action={updateOrderStatus}
                    />
                  </td>
                  <td className={tableTd}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteOrder} id={o.id} />
                  </td>
                </tr>
              ))}
              {(orders ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={7}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
