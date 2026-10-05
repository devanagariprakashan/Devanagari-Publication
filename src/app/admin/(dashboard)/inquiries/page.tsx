import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteInquiry, updateInquiryStatus } from "@/actions/inquiries";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { InquiryDetailsButton } from "@/components/admin/InquiryDetailsButton";
import { card, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, Pill, StatCards } from "@/components/admin/PageHeader";
import { CheckCircle2, MailOpen, MessageSquare, Reply } from "lucide-react";

const STATUSES = [
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_TONE: Record<string, "amber" | "blue" | "green" | "gray"> = {
  unread: "amber",
  read: "gray",
  replied: "blue",
  resolved: "green",
};

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const all = inquiries ?? [];
  const counts = new Map<string, number>();
  for (const i of all) counts.set(i.status, (counts.get(i.status) ?? 0) + 1);
  const rows = status ? all.filter((i) => i.status === status) : all;

  const tabs = [{ value: "", label: "All" }, ...STATUSES];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Messages sent from the contact form. Mark them as you work through them so nothing gets missed."
      />

      <StatCards
        id="inquiries"
        items={[
          { label: "Total Inquiries", value: all.length, icon: MessageSquare, tone: "rose", sub: "All time" },
          { label: "Unread", value: counts.get("unread") ?? 0, icon: MailOpen, tone: "amber", sub: "Needs attention" },
          { label: "Replied", value: counts.get("replied") ?? 0, icon: Reply, tone: "blue", sub: "Awaiting customer" },
          { label: "Resolved", value: counts.get("resolved") ?? 0, icon: CheckCircle2, tone: "emerald", sub: "Closed" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = status === tab.value;
          const count = tab.value ? counts.get(tab.value) ?? 0 : all.length;
          return (
            <Link
              key={tab.value || "all"}
              href={tab.value ? `/admin/inquiries?status=${tab.value}` : "/admin/inquiries"}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50/50"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className={tableTh}>From</th>
                <th className={tableTh}>Message</th>
                <th className={tableTh}>Status</th>
                <th className={tableTh}>Received</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((i) => (
                <tr key={i.id} className={i.status === "unread" ? "bg-amber-50/40" : "transition hover:bg-rose-50/40"}>
                  <td className={tableTd}>
                    <div className={i.status === "unread" ? "font-semibold text-gray-900" : "font-medium text-gray-900"}>
                      {i.name}
                    </div>
                    <div className="text-xs text-gray-500">{i.email ?? "No email"}</div>
                    {i.phone && <div className="text-xs text-gray-500">{i.phone}</div>}
                  </td>
                  <td className={tableTd}>
                    <span className="block max-w-md truncate" title={i.message}>
                      {i.message}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <Pill tone={STATUS_TONE[i.status] ?? "gray"}>
                      {STATUSES.find((s) => s.value === i.status)?.label ?? i.status}
                    </Pill>
                  </td>
                  <td className={tableTd + " whitespace-nowrap text-gray-500"}>
                    {new Date(i.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <InquiryDetailsButton inquiry={i} statuses={STATUSES} updateStatus={updateInquiryStatus} />
                      <DeleteButton
                        action={deleteInquiry}
                        id={i.id}
                        itemName={`Inquiry from ${i.name}`}
                        confirmMessage="The message and its status will be permanently removed. This cannot be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <EmptyRow
                  colSpan={5}
                  icon={MessageSquare}
                  title={status ? "No inquiries with this status" : "No inquiries yet"}
                  hint={status ? undefined : "Messages from the contact form will show up here."}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
