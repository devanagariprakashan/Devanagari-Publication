import { createClient } from "@/lib/supabase/server";
import { deleteCoupon, updateCoupon, updateCouponStatus } from "@/actions/coupons";
import { CouponForm } from "@/components/admin/CouponForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { card, pageTitle, tableTd, tableTh } from "@/components/admin/ui";
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
      <h1 className={pageTitle}>Coupons</h1>

      <div className={card + " p-6"}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add Coupon</h2>
        <CouponForm />
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
                <tr key={c.id}>
                  <td className={tableTd}>{c.code}</td>
                  <td className={tableTd}>{c.title ?? "—"}</td>
                  <td className={tableTd}>{couponDiscountLabel(c)}</td>
                  <td className={tableTd}>₹{c.min_amount}</td>
                  <td className={tableTd}>
                    <StatusSelect
                      id={c.id}
                      value={c.is_active ? "active" : "inactive"}
                      options={STATUSES}
                      action={updateCouponStatus}
                    />
                  </td>
                  <td className={tableTd}>
                    <span className={c.is_featured ? "text-green-600" : "text-gray-400"}>
                      {c.is_featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={tableTd}>
                    <div className="flex items-center gap-2">
                      <details className="relative">
                        <summary className="cursor-pointer rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900">
                          Edit
                        </summary>
                        <div className={card + " absolute z-10 mt-2 w-96 p-4"}>
                          <CouponForm action={updateCoupon} coupon={c} />
                        </div>
                      </details>
                      <DeleteButton action={deleteCoupon} id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className={tableTd} colSpan={7}>
                    No coupons yet.
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
