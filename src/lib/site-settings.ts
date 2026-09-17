import { createClient } from "@/lib/supabase/client";

export type SiteSettings = {
  full_name: string;
  email: string;
  phones: string;
  address: string;
  youtube_url: string;
  whatsapp_url: string;
  instagram_url: string;
  telegram_url: string;
  // Shipping & delivery
  shipping_flat_rate: number;
  free_shipping_enabled: boolean;
  free_shipping_threshold: number;
  express_shipping_enabled: boolean;
  express_shipping_rate: number;
  standard_delivery_days: string;
  express_delivery_days: string;
  // Cash on Delivery
  cod_enabled: boolean;
  cod_fee: number;
  cod_min_order: number | null;
  cod_max_order: number | null;
  // Online payments
  upi_enabled: boolean;
  card_enabled: boolean;
};

// ponytail: hardcoded fallback until site_settings row exists, drop when table seeded everywhere
export const SITE_DEFAULTS: SiteSettings = {
  full_name: "Devanagari Books & Publications",
  email: "support@devanagaribooks.com",
  phones: "+91 98765 43210 / (0755) 244-8900",
  address:
    "Devanagari Publication House, Press Complex, Zone-I, Bhopal, Madhya Pradesh - 462011",
  youtube_url: "https://youtube.com",
  whatsapp_url: "https://wa.me/919876543210",
  instagram_url: "https://instagram.com",
  telegram_url: "https://telegram.org",
  shipping_flat_rate: 49,
  free_shipping_enabled: true,
  free_shipping_threshold: 499,
  express_shipping_enabled: true,
  express_shipping_rate: 49,
  standard_delivery_days: "3-5 days",
  express_delivery_days: "1-2 days",
  cod_enabled: true,
  cod_fee: 0,
  cod_min_order: null,
  cod_max_order: null,
  upi_enabled: true,
  card_enabled: true,
};

// ponytail: single shared reader (TopBanner pattern), no caching layer until traffic needs it
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data } = await createClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return SITE_DEFAULTS;
    return { ...SITE_DEFAULTS, ...data, full_name: data.full_name ?? SITE_DEFAULTS.full_name } as SiteSettings;
  } catch {
    return SITE_DEFAULTS;
  }
}

export function firstPhone(phones: string): string {
  return phones.split(/[\n,/]/).map((s) => s.trim()).filter(Boolean)[0] ?? SITE_DEFAULTS.phones;
}

export type ShippingMethod = "standard" | "express";

// Express is a flat add-on regardless of order value; standard follows the free-shipping threshold.
export function computeShippingCharge(
  settings: Pick<SiteSettings, "shipping_flat_rate" | "free_shipping_enabled" | "free_shipping_threshold" | "express_shipping_enabled" | "express_shipping_rate">,
  method: ShippingMethod,
  subtotal: number
): number {
  if (method === "express" && settings.express_shipping_enabled) return settings.express_shipping_rate;
  if (settings.free_shipping_enabled && subtotal >= settings.free_shipping_threshold) return 0;
  return settings.shipping_flat_rate;
}

export function checkCodEligibility(
  settings: Pick<SiteSettings, "cod_enabled" | "cod_min_order" | "cod_max_order">,
  subtotal: number
): { eligible: boolean; reason?: string } {
  if (!settings.cod_enabled) return { eligible: false, reason: "Cash on Delivery is currently unavailable" };
  if (settings.cod_min_order != null && subtotal < settings.cod_min_order) {
    return { eligible: false, reason: `COD is available on orders above ₹${settings.cod_min_order}` };
  }
  if (settings.cod_max_order != null && subtotal > settings.cod_max_order) {
    return { eligible: false, reason: `COD is available on orders up to ₹${settings.cod_max_order}` };
  }
  return { eligible: true };
}
