"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { requestPasswordReset, resetPassword } from "@/actions/customer-auth";

const inputCls =
  "w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200/90 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150";
const buttonCls =
  "w-full py-3.5 px-5 rounded-xl bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-75";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const sendCode = async () => {
    setErrorMessage("");
    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address");
      return false;
    }
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if ("error" in result) {
        setErrorMessage(result.error);
        return false;
      }
      setResendIn(45);
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await sendCode()) {
      setCode("");
      setStep("reset");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!/^\d{6}$/.test(code.trim())) {
      setErrorMessage("Please enter the 6-digit code from your email");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }
    setIsLoading(true);
    try {
      const result = await resetPassword({ email, code, password });
      if ("error" in result) {
        setErrorMessage(result.error);
        return;
      }
      setStep("done");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[460px] bg-white rounded-2xl sm:rounded-[26px] border border-red-100/70 shadow-[0_12px_40px_rgba(200,40,40,0.07)] p-6 sm:p-8 md:p-9 transition-all">
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Reset your <span className="text-[#C61821]">password</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5">
            {step === "email" && "Enter your email to receive a 6-digit verification code"}
            {step === "reset" && "Enter the code we emailed you and choose a new password"}
            {step === "done" && "Your password has been updated"}
          </p>
        </div>

        {step === "done" ? (
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Password changed</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              You can now log in with your new password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
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

            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs sm:text-[13px] font-semibold text-gray-800">
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
                      autoComplete="email"
                      className={inputCls}
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className={buttonCls}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Code</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 sm:space-y-5">
                <div className="rounded-xl bg-rose-50/60 border border-rose-100 p-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  If <strong className="text-gray-900">{email.trim()}</strong> has an account, a 6-digit code is on its way. It is valid for 10 minutes.
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="code" className="block text-xs sm:text-[13px] font-semibold text-gray-800">
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="------"
                    className="w-full py-3 bg-white border border-gray-200/90 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className="block text-xs sm:text-[13px] font-semibold text-gray-800">
                    New password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                      <Lock className="w-4 h-4" strokeWidth={2.2} />
                    </div>
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className={inputCls + " pr-11"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-700 p-1 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className={buttonCls}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs sm:text-[13px]">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setErrorMessage("");
                    }}
                    className="font-semibold text-gray-600 hover:text-[#C61821] cursor-pointer"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={() => void sendCode()}
                    disabled={resendIn > 0 || isLoading}
                    className="font-semibold text-[#C61821] hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                  >
                    {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}

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
