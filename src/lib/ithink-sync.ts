import { createAdminClient } from "@/lib/supabase/admin";

// Keeps orders.order_status in step with iThink Logistics' live tracking.
// Orders only move forward (confirmed -> shipped -> delivered); a cancelled shipment never cancels the order.

type ScanRow = Record<string, unknown>;

const BATCH_SIZE = 10;
// Opening the orders page triggers a sync, but never more than once a minute per scope (admin = all orders, customer = their email).
const MIN_INTERVAL_MS = 60 * 1000;
const lastRun = new Map<string, number>();

const IST = "+05:30";
const toIso = (value: unknown) =>
  typeof value === "string" && /[1-9]/.test(value) ? new Date(value.trim().replace(" ", "T") + IST).toISOString() : null;

function statusFrom(current: string): "delivered" | "shipped" | null {
  const s = current.toLowerCase();
  if (/cancel/.test(s)) return null;
  if (/deliver/.test(s) && !/undeliver|not deliver|out for|rto|return/.test(s)) return "delivered";
  if (/pick|transit|reached|out for|dispatch|shipped|rto|return|undeliver|attempt|hub|bagged/.test(s)) return "shipped";
  return null; // manifested / new: still just confirmed
}

async function fetchTracking(awbs: string[]): Promise<Record<string, ScanRow>> {
  const accessToken = process.env.ITHINK_ACCESS_TOKEN?.trim();
  const secretKey = process.env.ITHINK_SECRET_KEY?.trim();
  if (!accessToken || !secretKey) return {};
  const response = await fetch("https://api.ithinklogistics.com/api_v3/order/track.json", {
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify({ data: { awb_number_list: awbs.join(","), access_token: accessToken, secret_key: secretKey } }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return {};
  const json = (await response.json()) as { data?: Record<string, ScanRow> };
  return json.data && typeof json.data === "object" ? json.data : {};
}

export type SyncResult = { checked: number; updated: number; skipped?: boolean };

/** Pulls live status for every order that has an AWB and isn't finished, and updates the ones that moved. */
export async function syncOrderStatusesFromIthink({
  email,
  force = false,
}: { email?: string; force?: boolean } = {}): Promise<SyncResult> {
  const scope = email ? `email:${email.toLowerCase()}` : "all";
  if (!force && Date.now() - (lastRun.get(scope) ?? 0) < MIN_INTERVAL_MS) return { checked: 0, updated: 0, skipped: true };
  lastRun.set(scope, Date.now());

  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select("id, awb_number, order_status, created_at, confirmed_at, shipped_at, delivered_at")
    .not("awb_number", "is", null)
    .not("order_status", "in", "(delivered,cancelled,payment_failed)");
  if (email) query = query.eq("customer_email", email.toLowerCase());
  const { data: orders, error } = await query;
  if (error || !orders?.length) return { checked: 0, updated: 0 };

  let updated = 0;
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    let tracking: Record<string, ScanRow> = {};
    try {
      tracking = await fetchTracking(batch.map((o) => o.awb_number as string));
    } catch {
      continue; // iThink unreachable for this batch — try again on the next sync
    }

    for (const order of batch) {
      const entry = tracking[order.awb_number as string];
      if (!entry) continue;
      const next = statusFrom(String(entry.current_status ?? ""));
      if (!next || next === order.order_status) continue;

      const scans = Array.isArray(entry.scan_details) ? (entry.scan_details as ScanRow[]) : [];
      const picked = scans.find((s) => /pick/.test(`${s.status} ${s.status_code}`.toLowerCase()));
      const last = (entry.last_scan_details ?? {}) as ScanRow;
      const patch: Record<string, unknown> = { order_status: next };
      if (!order.confirmed_at) patch.confirmed_at = order.created_at;
      if (!order.shipped_at) patch.shipped_at = toIso(picked?.status_date_time) ?? toIso(last.status_date_time) ?? new Date().toISOString();
      if (next === "delivered" && !order.delivered_at) patch.delivered_at = toIso(last.status_date_time) ?? new Date().toISOString();

      const { error: updateError } = await admin.from("orders").update(patch).eq("id", order.id);
      if (!updateError) updated++;
    }
  }
  return { checked: orders.length, updated };
}
