"use client";

import { createContext, useContext } from "react";
import type { Coupon } from "@/lib/coupon-shared";

const FeaturedCouponContext = createContext<Coupon | null>(null);

export function FeaturedCouponProvider({
  coupon,
  children,
}: {
  coupon: Coupon | null;
  children: React.ReactNode;
}) {
  return (
    <FeaturedCouponContext.Provider value={coupon}>
      {children}
    </FeaturedCouponContext.Provider>
  );
}

export function useFeaturedCoupon(): Coupon | null {
  return useContext(FeaturedCouponContext);
}
