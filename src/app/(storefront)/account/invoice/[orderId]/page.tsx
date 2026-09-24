import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";
import InvoiceActions from "./InvoiceActions";

interface Props {
  params: Promise<{ orderId: string }>;
}

function money(value: number | null | undefined) {
  return `₹${(Number(value) || 0).toLocaleString("en-IN")}`;
}

export default async function InvoicePage({ params }: Props) {
  const { orderId } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: settingsRow }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(id, product_name, quantity, unit_price)")
      .eq("id", orderId)
      .maybeSingle(),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (!order) notFound();

  const site: SiteSettings = { ...SITE_DEFAULTS, ...(settingsRow ?? {}) };
  const items = (order.order_items ?? []) as { id: string; product_name: string; quantity: number; unit_price: number }[];
  const subtotal = order.subtotal_amount != null ? Number(order.subtotal_amount) : items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const discount = Number(order.discount_amount ?? 0);
  const shipping = Number(order.shipping_charge ?? 0);
  const codFee = Number(order.cod_fee ?? 0);
  const total = Number(order.total_amount ?? 0);
  const orderDate = new Date(order.created_at as string).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen print:min-h-0 bg-[#F4F4F5] py-6 sm:py-10 print:bg-white print:py-0">
      <div className="max-w-[820px] mx-auto px-4 sm:px-0">
        <InvoiceActions />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 print:border-0 print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#C61821] flex items-center justify-center text-white shrink-0">
                  <span className="font-devanagariDisplay text-xl font-bold leading-none">दे</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">{site.full_name}</p>
                  <p className="text-[11px] text-gray-400">Books &amp; Publications</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed max-w-xs">{site.address}</p>
              <p className="text-xs text-gray-500 mt-1">{site.email} · {site.phones}</p>
            </div>
            <div className="text-right shrink-0">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Invoice</h1>
              <p className="text-xs text-gray-500 mt-1">Order #{order.order_number}</p>
              <p className="text-xs text-gray-500">{orderDate}</p>
            </div>
          </div>

          {/* Bill to / Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-100">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Billed &amp; Shipped To</h3>
              <p className="text-sm font-bold text-gray-900">{order.customer_name ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.customer_phone ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {order.shipping_address ?? "—"}
                {order.landmark ? `, ${order.landmark}` : ""}, {order.city ?? ""}
                {order.state ? `, ${order.state}` : ""}
                {order.pincode ? ` - ${order.pincode}` : ""}
              </p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Payment</h3>
              <p className="text-xs text-gray-600">Method: <span className="font-semibold text-gray-900">{order.payment_method === "cod" ? "Cash on Delivery" : (order.payment_method ?? "Online")}</span></p>
              <p className="text-xs text-gray-600 mt-0.5">Status: <span className="font-semibold text-gray-900 capitalize">{order.payment_status}</span></p>
              <p className="text-xs text-gray-600 mt-0.5">Order status: <span className="font-semibold text-gray-900 capitalize">{order.order_status}</span></p>
            </div>
          </div>

          {/* Items table */}
          <div className="py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-2 font-bold">Item</th>
                  <th className="py-2 font-bold text-center w-20">Qty</th>
                  <th className="py-2 font-bold text-right w-28">Price</th>
                  <th className="py-2 font-bold text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 text-gray-900 font-medium">{item.product_name}</td>
                    <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">{money(item.unit_price)}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">{money(item.quantity * item.unit_price)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-xs">No line items recorded for this order.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span><span>-{money(discount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping > 0 ? money(shipping) : "Free"}</span></div>
              {codFee > 0 && <div className="flex justify-between text-gray-600"><span>COD Handling Fee</span><span>{money(codFee)}</span></div>}
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>{money(total)}</span></div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-10 pt-6 border-t border-gray-100">
            Thank you for shopping with {site.full_name}. This is a computer-generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
