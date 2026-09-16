export type Coupon = {
  id: string;
  code: string;
  title: string | null;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

export function couponDiscountLabel(coupon: {
  discount_type: string;
  discount_value: number;
}): string {
  return coupon.discount_type === "fixed"
    ? `₹${coupon.discount_value}`
    : `${coupon.discount_value}%`;
}

export function couponHeadline(coupon: Coupon): string {
  return (
    coupon.title?.trim() ||
    `Save ${couponDiscountLabel(coupon)} on select titles`
  );
}

export function couponDiscount(
  coupon: Coupon | null | undefined,
  subtotal: number,
): number {
  if (!coupon || !coupon.is_active) return 0;
  if (subtotal < (coupon.min_amount ?? 0)) return 0;
  return coupon.discount_type === "fixed"
    ? Math.min(subtotal, coupon.discount_value)
    : Math.round((subtotal * coupon.discount_value) / 100);
}
