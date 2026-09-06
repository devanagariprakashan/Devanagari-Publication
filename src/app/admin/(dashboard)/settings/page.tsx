import { card, pageTitle } from "@/components/admin/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Settings</h1>
      <div className={card + " p-6"}>
        <p className="text-sm text-gray-600">
          Site settings such as announcement banners, store details, and delivery
          options are managed via Supabase.
        </p>
      </div>
    </div>
  );
}
