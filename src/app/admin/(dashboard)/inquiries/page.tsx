import { createClient } from "@/lib/supabase/server";
import { deleteInquiry, updateInquiryStatus } from "@/actions/inquiries";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

const STATUSES = [
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "resolved", label: "Resolved" },
];

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Inquiries</h1>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Name</th>
                <th className={tableTh}>Email</th>
                <th className={tableTh}>Phone</th>
                <th className={tableTh}>Message</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Created</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(inquiries ?? []).map((i) => (
                <tr key={i.id}>
                  <td className={tableTd}>{i.name}</td>
                  <td className={tableTd}>{i.email ?? "—"}</td>
                  <td className={tableTd}>{i.phone ?? "—"}</td>
                  <td className={tableTd}>
                    <span className="block max-w-xs truncate" title={i.message}>
                      {i.message}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={i.id}
                      value={i.status}
                      options={STATUSES}
                      action={updateInquiryStatus}
                    />
                  </td>
                  <td className={tableTd}>
                    {new Date(i.created_at).toLocaleDateString()}
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteInquiry} id={i.id} />
                  </td>
                </tr>
              ))}
              {(inquiries ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={7}>
                    No inquiries yet.
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
