import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "@/lib/coupon-shared";

// ponytail: swallow errors and return empty so the storefront falls back to the static
// offer when the coupons table has not been migrated yet.
export async function getFeaturedCoupon(): Promise<Coupon | null> {
  try {
    const { data } = await (await createClient())
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    return (data as Coupon) ?? null;
  } catch {
    return null;
  }
}

export async function getActiveCoupons(): Promise<Coupon[]> {
  try {
    const { data } = await (await createClient())
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .order("created_at");
    return (data as Coupon[]) ?? [];
  } catch {
    return [];
  }
}

export async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  try {
    const { data } = await (await createClient())
      .from("coupons")
      .select("*")
      .eq("code", normalized)
      .eq("is_active", true)
      .maybeSingle();
    return (data as Coupon) ?? null;
  } catch {
    return null;
  }
}
