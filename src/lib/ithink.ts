import { createAdminClient } from "@/lib/supabase/admin";

type Order = {
  id: string; order_number: string; customer_name: string | null; customer_email: string | null;
  customer_phone: string | null; total_amount: number; payment_method: string | null;
  shipping_address: string | null; landmark: string | null; city: string | null;
  state: string | null; pincode: string | null; shipment_status: string | null;
  shipping_charge: number | null;
};
type OrderItem = { product_name: string; product_sku: string | null; quantity: number; unit_price: number };

function getConfig() {
  const accessToken = process.env.ITHINK_ACCESS_TOKEN?.trim();
  const secretKey = process.env.ITHINK_SECRET_KEY?.trim();
  const pickupAddressId = process.env.ITHINK_PICKUP_ADDRESS_ID?.trim();
  if (!accessToken || !secretKey || !pickupAddressId) return null;
  return { accessToken, secretKey, pickupAddressId, apiUrl: process.env.ITHINK_API_URL?.trim() || "https://my.ithinklogistics.com/api_v3/order/add.json" };
}

// The warehouse's pincode rarely changes — cache it in-memory per server instance instead of hitting iThink on every rate check.
let cachedPickupPincode: { value: string; fetchedAt: number } | null = null;
const PICKUP_PINCODE_TTL_MS = 30 * 60 * 1000;

async function getPickupPincode(): Promise<string> {
  if (cachedPickupPincode && Date.now() - cachedPickupPincode.fetchedAt < PICKUP_PINCODE_TTL_MS) {
    return cachedPickupPincode.value;
  }
  const config = getConfig();
  if (!config) throw new Error("iThink Logistics API credentials are not configured on the server.");

  const response = await fetch("https://my.ithinklogistics.com/api_v3/warehouse/get.json", {
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify({ data: { warehouse_id: config.pickupAddressId, access_token: config.accessToken, secret_key: config.secretKey } }),
    signal: AbortSignal.timeout(15000),
  });
  const raw = await response.text();
  let result: unknown; try { result = JSON.parse(raw); } catch { result = { raw }; }
  if (!response.ok) throw new Error(`iThink returned HTTP ${response.status} while looking up the pickup warehouse.`);
  const resultRecord = (result && typeof result === "object" ? result as Record<string, unknown> : {});
  if (resultRecord.status === "error") {
    throw new Error(typeof resultRecord.html_message === "string" ? resultRecord.html_message : "Could not look up the pickup warehouse.");
  }
  const rows = Array.isArray(resultRecord.data) ? resultRecord.data as Record<string, unknown>[] : [];
  const warehouse = rows.find((row) => String(row.id) === config.pickupAddressId) ?? rows[0];
  const pincode = warehouse && typeof warehouse.pincode === "string" ? warehouse.pincode : null;
  if (!pincode) throw new Error("iThink did not return a pincode for the configured pickup warehouse.");

  cachedPickupPincode = { value: pincode, fetchedAt: Date.now() };
  return pincode;
}

function formatDate(date = new Date()) {
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

// iThink's shipping label system only accepts ASCII product names — a Devanagari-only title (common for our Hindi
// books) strips down to nothing and gets rejected as "required". Fall back to the SKU/a generic label in that case.
function asciiSafeName(name: string, fallback: string): string {
  const stripped = name.replace(/[^\x20-\x7E]/g, "").trim();
  return stripped || fallback;
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

export interface ShipmentOverrides {
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  courier?: string;
  serviceType?: string;
}

export async function createIthinkShipment(orderId: string, overrides: ShipmentOverrides = {}) {
  const config = getConfig();
  if (!config) return { status: "not_configured" as const };
  const admin = createAdminClient();
  const { data: order, error: orderError } = await admin.from("orders")
    .select("id,order_number,customer_name,customer_email,customer_phone,total_amount,payment_method,shipping_address,landmark,city,state,pincode,shipment_status,shipping_charge")
    .eq("id", orderId).maybeSingle<Order>();
  if (orderError) throw orderError;
  if (!order) throw new Error("Order not found for iThink shipment");
  if (order.shipment_status === "created") return { status: "already_created" as const };
  // Manual retries (e.g. an admin re-submitting with corrected dimensions) can restart from "failed", not just "pending".
  const { data: claimed, error: claimError } = await admin.from("orders")
    .update({ shipment_status: "processing", shipment_error: null }).eq("id", orderId).in("shipment_status", ["pending", "failed"])
    .select("id").maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) return { status: "already_processing" as const };
  const { data: items, error: itemsError } = await admin.from("order_items")
    .select("product_name,product_sku,quantity,unit_price").eq("order_id", orderId);
  if (itemsError) throw itemsError;
  const orderItems = (items || []) as OrderItem[];
  if (!orderItems.length) throw new Error("Order has no items for iThink shipment");

  // iThink validates total_amount as merchandise value only (products + shipping) — it must exclude the COD handling fee,
  // which is instead collected via cod_amount below. Sending the order's grand total here triggers "Invalid order total Amount".
  const merchandiseTotal = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) + Number(order.shipping_charge ?? 0);

  const shipment = {
    waybill: "", order: order.order_number, sub_order: "", order_date: formatDate(), total_amount: merchandiseTotal.toFixed(2),
    name: order.customer_name || "Customer", company_name: "", add: order.shipping_address || "", add2: order.landmark || "", add3: "",
    pin: order.pincode || "", city: order.city || "", state: order.state || "", country: "India", phone: order.customer_phone || "", alt_phone: "",
    email: order.customer_email || "", products: orderItems.map((item, idx) => ({ product_name: asciiSafeName(item.product_name, `Book (SKU: ${item.product_sku || `item-${idx + 1}`})`), product_sku: item.product_sku || item.product_name.slice(0, 40), product_quantity: String(item.quantity), product_price: Number(item.unit_price).toFixed(2), product_tax_rate: "", product_hsn_code: "", product_discount: "0" })),
    shipment_length: overrides.length || "10", shipment_width: overrides.width || "10", shipment_height: overrides.height || "10", weight: overrides.weight || "0.5", shipping_charges: Number(order.shipping_charge ?? 0).toFixed(2), giftwrap_charges: "0", transaction_charges: "0", total_discount: "0", first_attemp_discount: "0",
    cod_amount: order.payment_method === "cod" ? Number(order.total_amount).toFixed(2) : "0", payment_mode: order.payment_method === "cod" ? "COD" : "Prepaid", reseller_name: "", eway_bill_number: "", gst_number: "", return_address_id: config.pickupAddressId,
    is_billing_same_as_shipping: "yes",
  };
  try {
    // s_type ("surface" | "air") is iThink's own top-level field for the courier's service tier — not per-shipment.
    // Defaults to "surface" (cheaper, standard) unless the admin picked a specific rate quote with a different service type.
    // logistics forces a specific courier (e.g. "delhivery"); omitted, iThink auto-picks per the account's Courier Priority settings.
    const requestData: Record<string, unknown> = { shipments: [shipment], pickup_address_id: config.pickupAddressId, access_token: config.accessToken, secret_key: config.secretKey, s_type: (overrides.serviceType || "surface").toLowerCase() };
    if (overrides.courier) requestData.logistics = overrides.courier;
    const response = await fetch(config.apiUrl, { method: "POST", headers: { "content-type": "application/json", "cache-control": "no-cache" }, body: JSON.stringify({ data: requestData }), signal: AbortSignal.timeout(15000) });
    const raw = await response.text();
    let result: unknown; try { result = JSON.parse(raw); } catch { result = { raw }; }
    if (!response.ok) throw new Error(`iThink returned HTTP ${response.status}`);
    const resultRecord = (result && typeof result === "object" ? result as Record<string, unknown> : {});
    if (resultRecord.status === "error") {
      throw new Error(typeof resultRecord.html_message === "string" ? resultRecord.html_message : "iThink rejected the shipment");
    }
    // The batch call itself can report overall "success" while an individual shipment inside `data` still failed validation.
    const dataRecord = (resultRecord.data && typeof resultRecord.data === "object" ? resultRecord.data as Record<string, unknown> : {});
    const firstShipmentResult = Object.values(dataRecord)[0];
    if (firstShipmentResult && typeof firstShipmentResult === "object" && (firstShipmentResult as Record<string, unknown>).status === "error") {
      const remark = (firstShipmentResult as Record<string, unknown>).remark;
      throw new Error(typeof remark === "string" ? remark : "iThink rejected this shipment");
    }
    const waybill = extractWaybill(result);
    if (!waybill) throw new Error(`iThink accepted the request but returned no waybill number. Raw response: ${JSON.stringify(result).slice(0, 500)}`);
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

export interface ShipmentScan {
  status: string;
  location: string;
  dateTime: string;
  remark?: string;
}

export interface ShipmentTracking {
  awb: string;
  courier: string | null;
  currentStatus: string;
  expectedDeliveryDate: string | null;
  lastLocation: string | null;
  lastUpdate: string | null;
  history: ShipmentScan[];
}

export async function trackIthinkShipment(awb: string): Promise<ShipmentTracking> {
  const accessToken = process.env.ITHINK_ACCESS_TOKEN?.trim();
  const secretKey = process.env.ITHINK_SECRET_KEY?.trim();
  if (!accessToken || !secretKey) throw new Error("iThink Logistics API credentials are not configured on the server.");

  const response = await fetch("https://api.ithinklogistics.com/api_v3/order/track.json", {
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify({ data: { awb_number_list: awb, access_token: accessToken, secret_key: secretKey } }),
    signal: AbortSignal.timeout(15000),
  });
  const raw = await response.text();
  let result: unknown; try { result = JSON.parse(raw); } catch { result = { raw }; }
  if (!response.ok) throw new Error(`iThink returned HTTP ${response.status}`);

  const dataRecord = (result && typeof result === "object" ? (result as Record<string, unknown>).data : null) as Record<string, unknown> | null;
  const entry = dataRecord?.[awb] as Record<string, unknown> | undefined;
  if (!entry) throw new Error("No tracking data found for this AWB yet — it may take a little while after pickup.");
  if (entry.message && entry.message !== "success") throw new Error(typeof entry.message === "string" ? entry.message : "iThink could not find this shipment.");

  const lastScan = (entry.last_scan_details ?? {}) as Record<string, unknown>;
  const scans = Array.isArray(entry.scan_details) ? entry.scan_details as Record<string, unknown>[] : [];

  return {
    awb,
    courier: typeof entry.logistic === "string" ? entry.logistic : null,
    currentStatus: typeof entry.current_status === "string" ? entry.current_status : "Unknown",
    expectedDeliveryDate: typeof entry.expected_delivery_date === "string" ? entry.expected_delivery_date : null,
    lastLocation: typeof lastScan.scan_location === "string" ? lastScan.scan_location : null,
    lastUpdate: typeof lastScan.status_date_time === "string" ? lastScan.status_date_time : null,
    history: scans.map((scan) => ({
      status: typeof scan.status === "string" ? scan.status : "",
      location: typeof scan.scan_location === "string" ? scan.scan_location : "",
      dateTime: typeof scan.scan_date_time === "string" ? scan.scan_date_time : "",
      remark: typeof scan.remark === "string" ? scan.remark : undefined,
    })).reverse(),
  };
}

export interface CourierRate {
  courier: string;
  serviceType: string | null;
  rate: number;
  deliveryTat: string | null;
  zone: string | null;
  supportsCod: boolean;
  supportsPrepaid: boolean;
}

export interface RateCheckParams {
  toPincode: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  paymentMethod: "cod" | "prepaid";
  productMrp: string;
}

export async function getIthinkRates(params: RateCheckParams): Promise<CourierRate[]> {
  const accessToken = process.env.ITHINK_ACCESS_TOKEN?.trim();
  const secretKey = process.env.ITHINK_SECRET_KEY?.trim();
  if (!accessToken || !secretKey) throw new Error("iThink Logistics API credentials are not configured on the server.");
  // Looked up live from iThink's own warehouse record (by ITHINK_PICKUP_ADDRESS_ID) — never hardcoded.
  const fromPincode = await getPickupPincode();

  const requestData: Record<string, unknown> = {
    from_pincode: fromPincode,
    to_pincode: params.toPincode,
    shipping_length_cms: params.length,
    shipping_width_cms: params.width,
    shipping_height_cms: params.height,
    shipping_weight_kg: params.weight,
    order_type: "forward",
    payment_method: params.paymentMethod,
    product_mrp: params.productMrp,
    access_token: accessToken,
    secret_key: secretKey,
  };

  const response = await fetch("https://my.ithinklogistics.com/api_v3/rate/check.json", {
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify({ data: requestData }),
    signal: AbortSignal.timeout(15000),
  });
  const raw = await response.text();
  let result: unknown; try { result = JSON.parse(raw); } catch { result = { raw }; }
  if (!response.ok) throw new Error(`iThink returned HTTP ${response.status}`);
  const resultRecord = (result && typeof result === "object" ? result as Record<string, unknown> : {});
  if (resultRecord.status === "error") {
    throw new Error(typeof resultRecord.html_message === "string" ? resultRecord.html_message : "iThink could not calculate rates for this pincode/weight.");
  }
  const rows = Array.isArray(resultRecord.data) ? resultRecord.data as Record<string, unknown>[] : [];
  // iThink's rate/check endpoint ignores the s_type request filter and always returns every courier
  // enabled on the account — "service_type" (e.g. "Surface"/"Air") on each row is the only real signal,
  // so speed filtering has to happen client-side against that field, not via the request.
  return rows.map((row) => ({
    courier: typeof row.logistic_name === "string" ? row.logistic_name : "Unknown",
    serviceType: typeof row.service_type === "string" && row.service_type ? row.service_type : null,
    rate: typeof row.rate === "number" ? row.rate : Number(row.rate) || 0,
    deliveryTat: typeof row.delivery_tat === "string" ? row.delivery_tat : null,
    zone: typeof row.logistics_zone === "string" ? row.logistics_zone : null,
    supportsCod: row.cod === "Y",
    supportsPrepaid: row.prepaid === "Y",
  })).sort((a, b) => a.rate - b.rate);
}
