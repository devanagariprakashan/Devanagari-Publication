import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { btnPrimary, card, inputCls, labelCls, pageTitle } from "@/components/admin/ui";
import { SITE_DEFAULTS } from "@/lib/site-settings";

// ponytail: one upsert (id=1), no per-field actions/validation lib until admin needs it
async function saveSiteSettings(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const str = (k: string) => ((formData.get(k) as string) || "").trim() || null;
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
    },
    { onConflict: "id" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
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

        <button type="submit" className={btnPrimary}>Save</button>
      </form>
    </div>
  );
}
