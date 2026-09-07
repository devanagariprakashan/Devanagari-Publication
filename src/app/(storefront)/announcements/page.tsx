import { createClient } from "@/lib/supabase/server";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id,text,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1350px] mx-auto px-4 sm:px-8 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
      {(announcements ?? []).length === 0 && (
        <p className="text-sm text-gray-500">No announcements.</p>
      )}
      {(announcements ?? []).map((a) => (
        <p key={a.id} className="text-sm text-gray-700 border-b border-gray-100 pb-3">
          {a.text}
        </p>
      ))}
    </div>
  );
}
