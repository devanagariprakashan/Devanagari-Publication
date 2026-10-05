"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search, ExternalLink } from "lucide-react";
import MobileMenuButton from "@/components/admin/MobileMenuButton";
import { logout } from "@/actions/auth";

// One box for everything: an order number goes to Orders, an email or phone to Customers, text to Books.
function destinationFor(term: string) {
  const q = encodeURIComponent(term);
  if (/^ord-/i.test(term)) return `/admin/orders?q=${q}`;
  if (term.includes("@") || /^[+\d][\d\s-]{5,}$/.test(term)) return `/admin/customers?q=${q}`;
  return `/admin/books?q=${q}`;
}

export default function AdminHeader({ email, unreadInquiries = 0 }: { email?: string; unreadInquiries?: number }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const initial = (email ?? "A").charAt(0).toUpperCase();

  // Ctrl/Cmd + K focuses the search box from anywhere in the admin.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200/80 bg-white/80 px-4 backdrop-blur-md lg:px-8">
      <MobileMenuButton />

      <form
        className="relative w-full max-w-md flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          const value = term.trim();
          if (value) router.push(destinationFor(value));
        }}
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          ref={searchRef}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search books, orders, customers..."
          aria-label="Search the admin"
          className="h-10 w-full rounded-xl border border-transparent bg-stone-100 pl-10 pr-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-brand-500/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        <Link
          href="/admin/inquiries"
          aria-label={unreadInquiries > 0 ? `${unreadInquiries} unread inquiries` : "Inquiries"}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100"
        >
          <Bell className="h-5 w-5" />
          {unreadInquiries > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-white" />
          )}
        </Link>

        <div className="hidden h-8 w-px bg-stone-200 sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition hover:bg-stone-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {initial}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[11rem] truncate text-sm font-medium leading-tight text-stone-900">{email}</span>
              <span className="block text-xs leading-tight text-stone-500">Administrator</span>
            </span>
            <ChevronDown className={`hidden h-4 w-4 text-stone-400 transition sm:block ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-stone-200"
            >
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
              >
                <ExternalLink className="h-4 w-4 text-stone-400" />
                View site
              </a>
              <form action={logout}>
                <button
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-700 transition hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
