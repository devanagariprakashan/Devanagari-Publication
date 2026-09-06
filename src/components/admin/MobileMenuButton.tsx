"use client";

import { Menu } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

export default function MobileMenuButton() {
  const { setOpen } = useAdminSidebar();

  return (
    <button
      onClick={() => setOpen(true)}
      className="lg:hidden text-stone-600 hover:text-stone-900"
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
