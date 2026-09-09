"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Folder,
  Users,
  ShoppingCart,
  MessageSquare,
  Megaphone,
  Newspaper,
  Star,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { logout } from "@/actions/auth";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/whats-new", label: "What's New", icon: Newspaper },
  { href: "/admin/reviews", label: "Ratings & Reviews", icon: Star },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-stone-200">
      <div className="flex h-16 items-center justify-between px-6 border-b border-stone-200">
        <span className="text-xl font-bold text-brand">Devanagari</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-200">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </a>
        <form action={logout}>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const { open, setOpen } = useAdminSidebar();

  return (
    <>
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
