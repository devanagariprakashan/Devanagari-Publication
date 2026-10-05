import { NextResponse, after } from "next/server";
import { sendOrderConfirmation, siteUrlFrom } from "@/lib/order-emails";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayuResponseHash } from "@/lib/payu";

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
    await admin.from("orders").update({
      payment_status: status, order_status: status === "paid" ? "confirmed" : "payment_failed",
      payment_id: data.mihpayid || null,
    }).eq("id", orderId).eq("payment_status", "pending");
    // Idempotent: the webhook can fire for the same payment, and only the first call actually sends.
    if (status === "paid") {
      const siteUrl = siteUrlFrom(request);
      after(() => sendOrderConfirmation(orderId, siteUrl));
    }
  }
  const origin = new URL(request.url).origin;
  const destination = new URL("/checkout", origin);
  destination.searchParams.set("payu", status);
  if (orderId) destination.searchParams.set("order", orderId);
  if (order) destination.searchParams.set("amount", String(order.total_amount));
  if (!valid) destination.searchParams.set("error", "verification");
  return NextResponse.redirect(destination, 303);
}
