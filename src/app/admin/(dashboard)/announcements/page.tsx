import { createClient } from "@/lib/supabase/server";
import { deleteAnnouncement } from "@/actions/announcements";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Announcements</h1>

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Announcement</h2>
        <AnnouncementForm />
      </div>

      <div className={card}>
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
              {(announcements ?? []).map((a) => (
                <tr key={a.id}>
                  <td className={tableTd}>{a.text}</td>
                  <td className={tableTd}>
                    <span className={a.is_active ? "text-green-600" : "text-red-600"}>
                      {a.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteAnnouncement} id={a.id} />
                  </td>
                </tr>
              ))}
              {(announcements ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={4}>
                    No announcements yet.
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
