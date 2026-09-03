"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[460px] bg-white rounded-2xl sm:rounded-[26px] border border-red-100/70 shadow-[0_12px_40px_rgba(200,40,40,0.07)] p-6 sm:p-8 md:p-9 transition-all">
        {/* Header inside card before inputs */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Reset your <span className="text-[#C61821]">password</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Check your inbox</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              We have sent password reset instructions to <strong className="text-gray-800">{email}</strong>. Please check your email to continue.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-[#C61821] rounded-xl text-xs sm:text-sm font-medium animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-[13px] font-semibold text-gray-800"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                    <Mail className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200/90 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-xl bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-gray-600 hover:text-[#C61821] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
