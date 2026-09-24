import { Megaphone, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteAnnouncement, updateAnnouncement, updateAnnouncementStatus } from "@/actions/announcements";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { EditAnnouncementButton } from "@/components/admin/EditAnnouncementButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function relativeDate(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = announcements ?? [];
  const activeCount = rows.filter((a) => a.is_active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={pageTitle}>Announcements</h1>
        <p className="mt-1 text-sm text-gray-500">
          Site-wide banner messages shown in the notification bell for every visitor. Only active announcements are shown.
        </p>
      </div>

      <div className={card + " p-6"}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Megaphone className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-wide text-gray-500">Add Announcement</h2>
        </div>
        <AnnouncementForm />
      </div>

      <div className={card}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">All Announcements</h2>
          <span className="text-xs font-medium text-gray-500">
            {rows.length} total &middot; {activeCount} active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Text</th>
                <th className={tableTh}>Active</th>
                <th className={tableTh}>Created</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((a) => (
                <tr key={a.id} className="transition hover:bg-gray-50">
                  <td className={tableTd + " max-w-md font-medium text-gray-900"}>{a.text}</td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={a.id}
                      value={a.is_active ? "active" : "inactive"}
                      options={STATUSES}
                      action={updateAnnouncementStatus}
                    />
                  </td>
                  <td className={tableTd + " whitespace-nowrap text-gray-500"}>
                    {relativeDate(a.created_at)}
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <EditAnnouncementButton action={updateAnnouncement} announcement={a} />
                      <DeleteButton action={deleteAnnouncement} id={a.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={4}>
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-gray-500">No announcements yet. Add one above.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
