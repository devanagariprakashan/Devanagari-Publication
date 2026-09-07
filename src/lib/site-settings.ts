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
