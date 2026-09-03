"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Please enter your email or phone number");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }

    setIsLoading(true);
    // Simulate authentication & save user session
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Login successful! Redirecting to your account...");

      if (typeof window !== "undefined") {
        const isEmail = identifier.includes("@");
        const existingSession = localStorage.getItem("devanagari_user");
        let sessionData = {
          name: "Rahul Sharma",
          email: isEmail ? identifier : "rahulsharma@gmail.com",
          phone: !isEmail ? identifier : "+91 98765 43210",
        };
        if (existingSession) {
          try {
            const parsed = JSON.parse(existingSession);
            sessionData = {
              ...sessionData,
              ...parsed,
              email: isEmail ? identifier : parsed.email || sessionData.email,
              phone: !isEmail ? identifier : parsed.phone || sessionData.phone,
            };
          } catch (e) {
            console.error(e);
          }
        }
        localStorage.setItem("devanagari_user", JSON.stringify(sessionData));
        localStorage.removeItem("devanagari_logged_out");
        window.dispatchEvent(new Event("devanagari_user_updated"));
      }

      setTimeout(() => {
        router.push("/account");
      }, 800);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[460px] bg-white rounded-[5px] sm:rounded-[5px] border border-red-100/70 shadow-[0_12px_40px_rgba(200,40,40,0.07)] p-6 sm:p-8 md:p-9 transition-all">
        {/* Welcome back! & Subtitle right before input fields */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Welcome <span className="text-[#C61821]">back!</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1.5">
            Login to continue to your account
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-[#C61821] rounded-xl text-xs sm:text-sm font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Field 1: Email or Phone number */}
          <div className="space-y-1.5">
            <label
              htmlFor="identifier"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Email or Phone number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <Mail className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone number"
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <Lock className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-3 sm:py-3.5 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-700 p-1 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs sm:text-[13px] font-semibold text-[#C61821] hover:text-[#991016] hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-5 rounded-[5px] bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </>
            )}
          </button>
        </form>

        {/* Register footer link */}
        <div className="mt-3 text-center text-xs sm:text-[13px] text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#C61821] hover:text-[#991016] hover:underline transition-colors ml-0.5"
          >
            Register now
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
