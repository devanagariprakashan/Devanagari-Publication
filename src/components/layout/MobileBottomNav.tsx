"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

interface MobileBottomNavProps {
  cartCount?: number;
  wishlistCount?: number;
}

function MobileBottomNavContent({
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const filterParam = searchParams.get("filter");

  const {
    cartCount: globalCartCount,
    wishlistCount: globalWishlistCount,
    setIsCartDrawerOpen,
    setIsWishlistDrawerOpen,
    isCartDrawerOpen,
    isWishlistDrawerOpen,
  } = useCartWishlist();

  const cartCount = propCartCount !== undefined ? propCartCount : globalCartCount;
  const wishlistCount =
    propWishlistCount !== undefined ? propWishlistCount : globalWishlistCount;

  const navItems = [
    {
      id: "home",
      label: "Home",
      hindiLabel: "होम",
      href: "/",
      icon: Home,
      isActive: pathname === "/" && !isCartDrawerOpen && !isWishlistDrawerOpen,
      onClick: undefined,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      hindiLabel: "विशलिस्ट",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount,
      isActive:
        pathname === "/wishlist" ||
        isWishlistDrawerOpen ||
        (pathname === "/shop" &&
          (viewParam === "wishlist" || filterParam === "wishlist")),
      onClick: undefined,
    },
    {
      id: "cart",
      label: "Cart",
      hindiLabel: "कार्ट",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartCount,
      isActive:
        pathname === "/cart" ||
        isCartDrawerOpen ||
        (pathname === "/shop" &&
          (viewParam === "cart" || filterParam === "cart")),
      onClick: undefined,
    },
    {
      id: "profile",
      label: "Profile",
      hindiLabel: "प्रोफ़ाइल",
      href: "/account",
      icon: User,
      isActive:
        !isCartDrawerOpen &&
        !isWishlistDrawerOpen &&
        (pathname.startsWith("/account") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/forgot-password"),
      onClick: undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] transition-all"
      style={{
        paddingBottom: "max(6px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center h-full py-1 group transition-all duration-200 select-none ${
                active ? "text-[#C61821]" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {/* Active Top Accent Pill */}
              {active && (
                <span className="absolute top-0 w-8 h-1 bg-[#C61821] rounded-full shadow-[0_1px_4px_rgba(198,24,33,0.4)] animate-in fade-in zoom-in duration-200" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center p-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active
                      ? "scale-110 stroke-[2.4] text-[#C61821]"
                      : "stroke-[1.8] group-active:scale-95 text-gray-500 group-hover:text-gray-800"
                  }`}
                />

                {/* Notification Badge */}
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span
                    key={`mobile-badge-${item.id}-${item.badge}`}
                    className="absolute -top-1 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#C61821] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-200"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`text-[10.5px] mt-0.5 tracking-tight leading-none transition-colors duration-200 ${
                  active
                    ? "font-bold text-[#C61821]"
                    : "font-medium text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function MobileBottomNav(props: MobileBottomNavProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden h-16 bg-white border-t border-gray-100" />
      }
    >
      <MobileBottomNavContent {...props} />
    </Suspense>
  );
}
