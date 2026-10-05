import { createClient } from "@/lib/supabase/server";
import { deleteCoupon, updateCoupon, updateCouponStatus } from "@/actions/coupons";
import { CouponForm } from "@/components/admin/CouponForm";
import { EditCouponButton } from "@/components/admin/EditCouponButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, tableTd, tableTh } from "@/components/admin/ui";
import { EmptyRow, PageHeader, Pill, SectionCardHeader, StatCards } from "@/components/admin/PageHeader";
import { BadgeCheck, Star, Ticket } from "lucide-react";
import { couponDiscountLabel, type Coupon } from "@/lib/coupon-shared";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default async function CouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (coupons ?? []) as Coupon[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Discount codes customers can apply at checkout. The featured coupon is shown on the homepage and in the Books menu."
      />

      <StatCards
        id="coupons"
        items={[
          { label: "Total Coupons", value: rows.length, icon: Ticket, tone: "rose", sub: "All codes" },
          { label: "Active", value: rows.filter((c) => c.is_active).length, icon: BadgeCheck, tone: "emerald", sub: "Usable at checkout" },
          { label: "Inactive", value: rows.filter((c) => !c.is_active).length, icon: Ticket, tone: "amber", sub: "Switched off" },
          { label: "Featured", value: rows.filter((c) => c.is_featured).length, icon: Star, tone: "violet", sub: "Shown on homepage" },
        ]}
      />

      <div className={card + " p-6"}>
        <SectionCardHeader title="Add Coupon" description="Choose a percentage or a flat amount, and an optional minimum order." />
        <CouponForm />
      </div>

      <div className={card + " overflow-hidden"}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className={tableTh}>Code</th>
                <th className={tableTh}>Title</th>
                <th className={tableTh}>Discount</th>
                <th className={tableTh}>Min Amount</th>
                <th className={tableTh}>Active</th>
                <th className={tableTh}>Featured</th>
                <th className={tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((c) => (
                <tr key={c.id} className="transition hover:bg-rose-50/40">
                  <td className={tableTd}>
                    <code className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs font-semibold tracking-wide text-gray-900">
                      {c.code}
                    </code>
                  </td>
                  <td className={tableTd}>{c.title ?? "—"}</td>
                  <td className={tableTd}>
                    <Pill tone="blue">{couponDiscountLabel(c)}</Pill>
                  </td>
                  <td className={tableTd}>{Number(c.min_amount) > 0 ? `₹${c.min_amount}` : "No minimum"}</td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={c.id}
                      value={c.is_active ? "active" : "inactive"}
                      options={STATUSES}
                      action={updateCouponStatus}
                    />
                  </td>
                  <td className={tableTd}>
                    {c.is_featured ? <Pill tone="amber">Featured</Pill> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <EditCouponButton action={updateCoupon} coupon={c} />
                      <DeleteButton
                        action={deleteCoupon}
                        id={c.id}
                        itemName={c.code}
                        confirmMessage="Customers will no longer be able to use this coupon code. This cannot be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <EmptyRow colSpan={7} icon={Ticket} title="No coupons yet" hint="Create a coupon above to offer customers a discount at checkout." />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
