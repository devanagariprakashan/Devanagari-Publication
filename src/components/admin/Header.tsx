"use client";

import { usePathname } from "next/navigation";
import MobileMenuButton from "@/components/admin/MobileMenuButton";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/books": "Books",
  "/admin/categories": "Categories",
  "/admin/authors": "Authors",
  "/admin/orders": "Orders",
  "/admin/inquiries": "Inquiries",
  "/admin/whats-new": "What's New & Latest Updates",
  "/admin/reviews": "Ratings & Reviews",
  "/admin/announcements": "Announcements",
  "/admin/settings": "Settings",
};

export default function AdminHeader({ email }: { email?: string }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/90 px-4 backdrop-blur lg:px-8">
      <MobileMenuButton />
      <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
      {email && <div className="ml-auto text-sm text-stone-500">{email}</div>}
    </header>
  );
}
