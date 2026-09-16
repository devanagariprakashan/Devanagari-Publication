import { createClient } from "@/lib/supabase/server";
import { deleteNewsletterSubscriber, updateNewsletterStatus } from "@/actions/newsletter";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>Newsletter</h1>
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableTh}>Email</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Subscribed</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(subscribers ?? []).map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className={tableTd}>{subscriber.email}</td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={subscriber.id}
                      value={subscriber.status}
                      options={STATUSES}
                      action={updateNewsletterStatus}
                    />
                  </td>
                  <td className={tableTd}>
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                  <td className={tableTd}>
                    <DeleteButton action={deleteNewsletterSubscriber} id={subscriber.id} />
                  </td>
                </tr>
              ))}
              {(subscribers ?? []).length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={4}>No subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
