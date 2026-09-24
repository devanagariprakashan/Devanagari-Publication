"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function InvoiceActions() {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="print:hidden flex items-center justify-between mb-4">
      <Link
        href="/account?tab=orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold shadow-sm transition-colors"
      >
        <Printer className="w-3.5 h-3.5" />
        Download / Print Invoice
      </button>
    </div>
  );
}
