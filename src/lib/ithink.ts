import { createAdminClient } from "@/lib/supabase/admin";

type Order = {
  id: string; order_number: string; customer_name: string | null; customer_email: string | null;
  customer_phone: string | null; total_amount: number; payment_method: string | null;
  shipping_address: string | null; landmark: string | null; city: string | null;
  state: string | null; pincode: string | null; shipment_status: string | null;
};
type OrderItem = { product_name: string; product_sku: string | null; quantity: number; unit_price: number };

function getConfig() {
  const accessToken = process.env.ITHINK_ACCESS_TOKEN?.trim();
  const secretKey = process.env.ITHINK_SECRET_KEY?.trim();
  const pickupAddressId = process.env.ITHINK_PICKUP_ADDRESS_ID?.trim();
  if (!accessToken || !secretKey || !pickupAddressId) return null;
  return { accessToken, secretKey, pickupAddressId, apiUrl: process.env.ITHINK_API_URL?.trim() || "https://my.ithinklogistics.com/api_v3/order/add.json" };
}

function formatDate(date = new Date()) {
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

function extractWaybill(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const child of value) { const found = extractWaybill(child); if (found) return found; }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const key of ["waybill", "awb_number"]) if (typeof record[key] === "string" && record[key]) return record[key] as string;
  if (typeof record.awb_numbers === "string" && record.awb_numbers) return record.awb_numbers.split(",")[0].trim();
  for (const child of Object.values(record)) { const found = extractWaybill(child); if (found) return found; }
  return null;
}

export async function createIthinkShipment(orderId: string) {
  const config = getConfig();
  if (!config) return { status: "not_configured" as const };
  const admin = createAdminClient();
  const { data: order, error: orderError } = await admin.from("orders")
    .select("id,order_number,customer_name,customer_email,customer_phone,total_amount,payment_method,shipping_address,landmark,city,state,pincode,shipment_status")
    .eq("id", orderId).maybeSingle<Order>();
  if (orderError) throw orderError;
  if (!order) throw new Error("Order not found for iThink shipment");
  if (order.shipment_status === "created") return { status: "already_created" as const };
  const { data: claimed, error: claimError } = await admin.from("orders")
    .update({ shipment_status: "processing", shipment_error: null }).eq("id", orderId).eq("shipment_status", "pending")
    .select("id").maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) return { status: "already_processing" as const };
  const { data: items, error: itemsError } = await admin.from("order_items")
    .select("product_name,product_sku,quantity,unit_price").eq("order_id", orderId);
  if (itemsError) throw itemsError;
  const orderItems = (items || []) as OrderItem[];
  if (!orderItems.length) throw new Error("Order has no items for iThink shipment");

  const shipment = {
    waybill: "", order: order.order_number, sub_order: "", order_date: formatDate(), total_amount: Number(order.total_amount).toFixed(2),
    name: order.customer_name || "Customer", company_name: "", add: order.shipping_address || "", add2: order.landmark || "", add3: "",
    pin: order.pincode || "", city: order.city || "", state: order.state || "", country: "India", phone: order.customer_phone || "", alt_phone: "",
    email: order.customer_email || "", products: orderItems.map((item) => ({ product_name: item.product_name, product_sku: item.product_sku || item.product_name.slice(0, 40), product_quantity: String(item.quantity), product_price: Number(item.unit_price).toFixed(2), product_tax_rate: "", product_hsn_code: "", product_discount: "0" })),
    shipment_length: "10", shipment_width: "10", shipment_height: "10", weight: "0.5", shipping_charges: "0", giftwrap_charges: "0", transaction_charges: "0", total_discount: "0", first_attemp_discount: "0",
    cod_amount: order.payment_method === "cod" ? Number(order.total_amount).toFixed(2) : "0", payment_mode: order.payment_method === "cod" ? "COD" : "Prepaid", reseller_name: "", eway_bill_number: "", gst_number: "", return_address_id: config.pickupAddressId,
  };
  try {
    const response = await fetch(config.apiUrl, { method: "POST", headers: { "content-type": "application/json", "cache-control": "no-cache" }, body: JSON.stringify({ data: { shipments: [shipment], pickup_address_id: config.pickupAddressId, access_token: config.accessToken, secret_key: config.secretKey } }), signal: AbortSignal.timeout(15000) });
    const raw = await response.text();
    let result: unknown; try { result = JSON.parse(raw); } catch { result = { raw }; }
    if (!response.ok) throw new Error(`iThink returned HTTP ${response.status}`);
    const waybill = extractWaybill(result);
    const { error: updateError } = await admin.from("orders").update({ shipment_status: "created", shipment_id: order.order_number, awb_number: waybill, shipment_response: result }).eq("id", orderId);
    if (updateError) throw updateError;
    return { status: "created" as const, waybill };
  } catch (error) {
    const message = error instanceof Error ? error.message : "iThink shipment creation failed";
    await admin.from("orders").update({ shipment_status: "failed", shipment_error: message }).eq("id", orderId);
    console.error("iThink shipment creation failed", { orderId, message });
    return { status: "failed" as const, error: message };
  }
}
