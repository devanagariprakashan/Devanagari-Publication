"use client";

import React from "react";
import { Shield, ShieldCheck, Headphones } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-[#FFF7F6] via-[#FFFBFB] to-[#FBFBFC] text-gray-900 flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden selection:bg-red-100 selection:text-[#C61821]">
      {/* Subtle Dot Pattern */}
      <div
        className="absolute top-0 right-0 w-72 h-72 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#F87171 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* Subtle Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Form Container */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>

      {/* Trust Badges */}
      <div className="relative z-10 w-full max-w-[500px] mx-auto px-4 mt-3 sm:mt-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {/* Badge 1: 100% Secure */}
          <div className="flex items-center gap-2.5 justify-center p-2 rounded-[5px] bg-white/70 border border-rose-100/60 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-[#C61821]">
              <Shield className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                100% Secure
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Safe &amp; Encrypted
              </span>
            </div>
          </div>



          {/* Badge 2: 24/7 Support */}
          <div className="flex items-center gap-2.5 justify-center p-2 rounded-[5px] bg-white/70 border border-rose-100/60 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-[#C61821]">
              <Headphones className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                Help &amp; Support
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                Fast Assistance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
