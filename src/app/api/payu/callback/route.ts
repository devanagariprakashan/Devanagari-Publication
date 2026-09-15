import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayuResponseHash } from "@/lib/payu";
import { createIthinkShipment } from "@/lib/ithink";

export async function POST(request: Request) {
  const form = await request.formData();
  const data = Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)]));
  const orderId = data.udf1;
  const admin = createAdminClient();
  const { data: order } = orderId
    ? await admin.from("orders").select("id,total_amount,gateway_order_id").eq("id", orderId).maybeSingle()
    : { data: null };
  const valid = Boolean(
    order && data.txnid && data.key === process.env.PAYU_KEY &&
    order.gateway_order_id === data.txnid &&
    Number(order.total_amount).toFixed(2) === Number(data.amount).toFixed(2) &&
    verifyPayuResponseHash(data),
  );
  const status = data.status?.toLowerCase() === "success" && valid ? "paid" : "failed";
  if (orderId) {
    const { data: updatedOrder } = await admin.from("orders").update({
      payment_status: status, order_status: status === "paid" ? "confirmed" : "payment_failed",
      payment_id: data.mihpayid || null,
    }).eq("id", orderId).eq("payment_status", "pending").select("id,payment_status").maybeSingle();
    if (updatedOrder?.payment_status === "paid") await createIthinkShipment(orderId);
  }
  const origin = new URL(request.url).origin;
  const destination = new URL("/checkout", origin);
  destination.searchParams.set("payu", status);
  if (orderId) destination.searchParams.set("order", orderId);
  if (!valid) destination.searchParams.set("error", "verification");
  return NextResponse.redirect(destination, 303);
}
