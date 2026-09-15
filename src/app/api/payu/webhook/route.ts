import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayuResponseHash } from "@/lib/payu";
import { createIthinkShipment } from "@/lib/ithink";

type PayuPayload = Record<string, string>;

async function readPayload(request: Request): Promise<PayuPayload> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return Object.fromEntries(
      Object.entries(body as Record<string, unknown>).map(([key, value]) => [key, String(value ?? "")]),
    );
  }
  const form = await request.formData();
  return Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)]));
}

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request);
    const status = payload.status?.toLowerCase();
    const txnid = payload.txnid;
    const keyMatches = payload.key === process.env.PAYU_KEY;
    const hashMatches = verifyPayuResponseHash(payload);

    if (!txnid || !keyMatches || !hashMatches || !["success", "failure"].includes(status)) {
      return NextResponse.json({ error: "Invalid PayU webhook" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: order, error: orderError } = payload.udf1
      ? await admin.from("orders").select("id,total_amount,gateway_order_id,payment_status").eq("id", payload.udf1).maybeSingle()
      : await admin.from("orders").select("id,total_amount,gateway_order_id,payment_status").eq("gateway_order_id", txnid).maybeSingle();
    if (orderError) throw orderError;
    if (!order || order.gateway_order_id !== txnid || Number(order.total_amount).toFixed(2) !== Number(payload.amount).toFixed(2)) {
      return NextResponse.json({ error: "PayU transaction does not match an order" }, { status: 400 });
    }

    // The pending condition makes retries idempotent and prevents a later failure
    // notification from downgrading an already paid order.
    if (order.payment_status === "pending") {
      const nextStatus = status === "success" ? "paid" : "failed";
      const { error: updateError } = await admin.from("orders").update({
        payment_status: nextStatus,
        order_status: nextStatus === "paid" ? "confirmed" : "payment_failed",
        payment_id: payload.mihpayid || null,
      }).eq("id", order.id).eq("payment_status", "pending");
      if (updateError) throw updateError;
      if (nextStatus === "paid") await createIthinkShipment(order.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayU webhook failed", error);
    return NextResponse.json({ error: "Unable to process PayU webhook" }, { status: 500 });
  }
}
