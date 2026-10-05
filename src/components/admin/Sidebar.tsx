"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Folder,
  PenTool,
  ShoppingCart,
  UserRound,
  MessageSquare,
  Megaphone,
  Newspaper,
  Star,
  TicketPercent,
  Settings,
  ExternalLink,
  Image,
  Sparkles,
  LayoutTemplate,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { logout } from "@/actions/auth";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

type NavItem = { href: string; label: string; icon: React.ElementType };

const navSections: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Store",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: UserRound },
      { href: "/admin/books", label: "Books", icon: BookOpen },
      { href: "/admin/categories", label: "Categories", icon: Folder },
      { href: "/admin/authors", label: "Authors", icon: PenTool },
      { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
    ],
  },
  {
    title: "Homepage & Content",
    items: [
      { href: "/admin/hero", label: "Hero Section", icon: LayoutTemplate },
      { href: "/admin/hero-banner", label: "Hero Banner", icon: Image },
      { href: "/admin/whats-new", label: "What's New", icon: Sparkles },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/team", label: "Team", icon: Users },
    ],
  },
  {
    title: "Customers Say",
    items: [
      { href: "/admin/reviews", label: "Ratings & Reviews", icon: Star },
      { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    ],
  },
  { title: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-stone-200">
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-stone-200">
        <Link href="/admin" onClick={onClose} className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-brand">Devanagari</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, index) => (
          <div key={section.title ?? index} className={index > 0 ? "mt-5" : ""}>
            {section.title && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-stone-200 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View Site
        </a>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4 shrink-0" />
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
