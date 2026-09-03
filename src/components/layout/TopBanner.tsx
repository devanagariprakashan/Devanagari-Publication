"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Truck, Crosshair, HelpCircle } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="bg-[#B51218] text-white text-xs sm:text-[13px] font-medium py-2 px-4 sm:px-8 border-b border-red-900/30 hidden lg:block">
      <div className="max-w-[1350px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left message */}
        <div className="flex items-center gap-2 tracking-wide text-center sm:text-left">
          <Truck className="w-4 h-4 text-white/90 shrink-0" />
          <span>Free Shipping on Orders Above <span className="font-semibold">₹499</span></span>
        </div>

        {/* Right quick links */}
        <div className="flex items-center gap-4 text-white/90 text-[12px] sm:text-[13px]">
          <a
            href="#track-order"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </a>
          <span className="text-white/40">|</span>
          <a
            href="#help"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
