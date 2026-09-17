import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { btnPrimary, card, inputCls, labelCls, pageTitle } from "@/components/admin/ui";
import { SITE_DEFAULTS } from "@/lib/site-settings";

// ponytail: one upsert (id=1), no per-field actions/validation lib until admin needs it
async function saveSiteSettings(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const str = (k: string) => ((formData.get(k) as string) || "").trim() || null;
  const bool = (k: string) => formData.get(k) === "on";
  const num = (k: string, fallback: number) => {
    const v = formData.get(k) as string;
    const n = Number(v);
    return v?.trim() && !Number.isNaN(n) ? n : fallback;
  };
  const numOrNull = (k: string) => {
    const v = (formData.get(k) as string)?.trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  const { error } = await supabase.from("site_settings").upsert(
    {
      id: 1,
      full_name: str("full_name"),
      email: str("email"),
      phones: str("phones"),
      address: str("address"),
      youtube_url: str("youtube_url"),
      whatsapp_url: str("whatsapp_url"),
      instagram_url: str("instagram_url"),
      telegram_url: str("telegram_url"),
      shipping_flat_rate: num("shipping_flat_rate", SITE_DEFAULTS.shipping_flat_rate),
      free_shipping_enabled: bool("free_shipping_enabled"),
      free_shipping_threshold: num("free_shipping_threshold", SITE_DEFAULTS.free_shipping_threshold),
      express_shipping_enabled: bool("express_shipping_enabled"),
      express_shipping_rate: num("express_shipping_rate", SITE_DEFAULTS.express_shipping_rate),
      standard_delivery_days: str("standard_delivery_days") ?? SITE_DEFAULTS.standard_delivery_days,
      express_delivery_days: str("express_delivery_days") ?? SITE_DEFAULTS.express_delivery_days,
      cod_enabled: bool("cod_enabled"),
      cod_fee: num("cod_fee", SITE_DEFAULTS.cod_fee),
      cod_min_order: numOrNull("cod_min_order"),
      cod_max_order: numOrNull("cod_max_order"),
      upi_enabled: bool("upi_enabled"),
      card_enabled: bool("card_enabled"),
    },
    { onConflict: "id" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = { ...SITE_DEFAULTS, ...(data ?? {}) };

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Settings</h1>
      <form action={saveSiteSettings} className="space-y-6">
        <div className={card + " p-6"}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Manage Profile</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="full_name">Full Name</label>
              <input id="full_name" name="full_name" defaultValue={s.full_name} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" defaultValue={s.email} className={inputCls + " mt-1"} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls} htmlFor="phones">Phone Numbers <span className="font-normal text-gray-400">(comma or newline separated)</span></label>
            <textarea id="phones" name="phones" rows={2} defaultValue={s.phones} className={inputCls + " mt-1"} />
          </div>
          <div className="mt-4">
            <label className={labelCls} htmlFor="address">Address</label>
            <textarea id="address" name="address" rows={2} defaultValue={s.address} className={inputCls + " mt-1"} />
          </div>
        </div>

        <div className={card + " p-6"}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Connect With Us</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="youtube_url">YouTube URL</label>
              <input id="youtube_url" name="youtube_url" defaultValue={s.youtube_url} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="whatsapp_url">WhatsApp URL</label>
              <input id="whatsapp_url" name="whatsapp_url" defaultValue={s.whatsapp_url} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="instagram_url">Instagram URL</label>
              <input id="instagram_url" name="instagram_url" defaultValue={s.instagram_url} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="telegram_url">Telegram URL</label>
              <input id="telegram_url" name="telegram_url" defaultValue={s.telegram_url} className={inputCls + " mt-1"} />
            </div>
          </div>
        </div>

        <div className={card + " p-6"}>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Shipping &amp; Delivery</h2>
          <p className="mb-4 text-xs text-gray-500">Controls the delivery charges and estimates shown in cart &amp; checkout.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="shipping_flat_rate">Standard Shipping Charge (₹)</label>
              <input id="shipping_flat_rate" name="shipping_flat_rate" type="number" min="0" step="1" defaultValue={s.shipping_flat_rate} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="standard_delivery_days">Standard Delivery Estimate</label>
              <input id="standard_delivery_days" name="standard_delivery_days" defaultValue={s.standard_delivery_days} placeholder="3-5 days" className={inputCls + " mt-1"} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" name="free_shipping_enabled" defaultChecked={s.free_shipping_enabled} className="h-4 w-4 rounded border-gray-300" />
              Enable free shipping above a threshold
            </label>
          </div>
          <div className="mt-4">
            <label className={labelCls} htmlFor="free_shipping_threshold">Free Shipping Threshold (₹)</label>
            <input id="free_shipping_threshold" name="free_shipping_threshold" type="number" min="0" step="1" defaultValue={s.free_shipping_threshold} className={inputCls + " mt-1 sm:max-w-xs"} />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" name="express_shipping_enabled" defaultChecked={s.express_shipping_enabled} className="h-4 w-4 rounded border-gray-300" />
              Offer express shipping
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="express_shipping_rate">Express Shipping Charge (₹)</label>
                <input id="express_shipping_rate" name="express_shipping_rate" type="number" min="0" step="1" defaultValue={s.express_shipping_rate} className={inputCls + " mt-1"} />
              </div>
              <div>
                <label className={labelCls} htmlFor="express_delivery_days">Express Delivery Estimate</label>
                <input id="express_delivery_days" name="express_delivery_days" defaultValue={s.express_delivery_days} placeholder="1-2 days" className={inputCls + " mt-1"} />
              </div>
            </div>
          </div>
        </div>

        <div className={card + " p-6"}>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Cash on Delivery</h2>
          <p className="mb-4 text-xs text-gray-500">When disabled, the COD option is hidden from checkout.</p>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" name="cod_enabled" defaultChecked={s.cod_enabled} className="h-4 w-4 rounded border-gray-300" />
            Enable Cash on Delivery
          </label>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="cod_fee">COD Handling Fee (₹)</label>
              <input id="cod_fee" name="cod_fee" type="number" min="0" step="1" defaultValue={s.cod_fee} className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="cod_min_order">Minimum Order for COD (₹)</label>
              <input id="cod_min_order" name="cod_min_order" type="number" min="0" step="1" defaultValue={s.cod_min_order ?? ""} placeholder="No minimum" className={inputCls + " mt-1"} />
            </div>
            <div>
              <label className={labelCls} htmlFor="cod_max_order">Maximum Order for COD (₹)</label>
              <input id="cod_max_order" name="cod_max_order" type="number" min="0" step="1" defaultValue={s.cod_max_order ?? ""} placeholder="No maximum" className={inputCls + " mt-1"} />
            </div>
          </div>
        </div>

        <div className={card + " p-6"}>
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Online Payments</h2>
          <p className="mb-4 text-xs text-gray-500">Choose which payment options appear at checkout. Gateway credentials are managed separately via environment variables.</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" name="upi_enabled" defaultChecked={s.upi_enabled} className="h-4 w-4 rounded border-gray-300" />
              Enable UPI
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" name="card_enabled" defaultChecked={s.card_enabled} className="h-4 w-4 rounded border-gray-300" />
              Enable Cards
            </label>
          </div>
        </div>

        <button type="submit" className={btnPrimary}>Save</button>
      </form>
    </div>
  );
}
