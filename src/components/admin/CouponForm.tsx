"use client";

import { useActionState } from "react";
import { createCoupon } from "@/actions/coupons";
import type { ActionResult } from "@/actions/books";
import type { Coupon } from "@/lib/coupon-shared";
import { btnPrimary, inputCls, labelCls } from "./ui";

export function CouponForm({
  action = createCoupon,
  coupon,
}: {
  action?: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  coupon?: Coupon;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-brand-700 md:col-span-2">
          {state.error}
        </div>
      )}
      {coupon && <input type="hidden" name="id" value={coupon.id} />}
      <div>
        <label className={labelCls}>Code *</label>
        <input
          name="code"
          required
          defaultValue={coupon?.code ?? ""}
          className={inputCls + " uppercase"}
          placeholder="UPSC25"
        />
      </div>
      <div>
        <label className={labelCls}>Title</label>
        <input
          name="title"
          defaultValue={coupon?.title ?? ""}
          className={inputCls}
          placeholder="Save 25% on 2025 Exam Editions"
        />
      </div>
      <div>
        <label className={labelCls}>Discount Type</label>
        <select name="discount_type" defaultValue={coupon?.discount_type ?? "percent"} className={inputCls}>
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Discount Value</label>
        <input
          name="discount_value"
          type="number"
          min="0"
          step="0.01"
          defaultValue={coupon?.discount_value ?? 0}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Min Amount</label>
        <input
          name="min_amount"
          type="number"
          min="0"
          step="0.01"
          defaultValue={coupon?.min_amount ?? 0}
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-6 pt-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={coupon ? coupon.is_active : true}
            className="h-4 w-4 rounded border-gray-300"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={coupon?.is_featured ?? false}
            className="h-4 w-4 rounded border-gray-300"
          />
          Featured
        </label>
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={isPending} className={btnPrimary}>
          {isPending ? "Saving..." : coupon ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>
    </form>
  );
}
