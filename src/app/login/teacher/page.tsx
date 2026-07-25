"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Mail,
  Loader2,
} from "lucide-react";
import { sendLoginOTP, verifyOTP } from "@/lib/actions/auth";

type Step = "email" | "otp";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await sendLoginOTP(email, "teacher");

    if (result.success) {
      setMessage(result.message || "OTP sent to your email");
      setStep("otp");
    } else {
      setError(result.error || "Failed to send OTP");
    }

    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpString = otp.join("");
    const result = await verifyOTP(email, otpString, "teacher");

    if (result.success) {
      router.push("/admin/dashboard");
    } else {
      setError(result.error || "Invalid OTP");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await sendLoginOTP(email, "teacher");

    if (result.success) {
      setMessage("New OTP sent to your email");
      setOtp(["", "", "", "", "", ""]);
    } else {
      setError(result.error || "Failed to resend OTP");
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-linear-to-br from-[#D4AF37]/10 to-transparent blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-tr from-[#1a1a1a]/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative z-10 m-4"
      >
        {/* Left Side - Visual/Brand */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#1a1a1a] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-linear-to-b from-[#1a1a1a]/85 via-[#1a1a1a]/95 to-[#1a1a1a]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight">
                <span>Quality </span>
                <span className="font-fm-gemunu text-[#fdf021] font-black text-3xl">ම </span>
                <span className="font-black">Econ</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 text-xs font-semibold rounded-full uppercase tracking-wider">
              Teacher Panel
            </span>
            <h2 className="text-5xl font-black leading-none tracking-tight">
              Manage Your <br />
              <span className="text-[#fdf021]">LMS Platform</span>
            </h2>
            <p className="text-gray-400 text-base max-w-md leading-relaxed">
              Log in to upload learning resources, schedule online classes, record student payments, and manage test results.
            </p>
          </div>

          <div className="relative z-10 flex gap-2">
            <div className="h-1 w-12 rounded-full bg-[#fdf021]" />
            <div className="h-1 w-4 rounded-full bg-gray-600" />
            <div className="h-1 w-4 rounded-full bg-gray-600" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full space-y-8">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center lg:text-left">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 mx-auto lg:mx-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Teacher Login
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Please enter your administrator email to receive an OTP.
                    </p>
                  </div>

                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 ml-1">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="teacher@econ.lk"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all placeholder:text-gray-400 text-gray-900"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm border border-red-100"
                      >
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#1a1a1a] hover:bg-black text-white h-14 rounded-xl font-semibold text-lg shadow-lg shadow-gray-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            Send OTP
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-[#D4AF37] to-[#F4C430] opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center lg:text-left">
                    <button
                      onClick={handleBack}
                      className="text-sm text-gray-500 hover:text-[#1a1a1a] mb-4 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      ← Back to email
                    </button>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Enter OTP
                    </h3>
                    <p className="text-gray-500 mt-2">
                      We sent a verification code to <br />
                      <span className="font-medium text-[#1a1a1a]">
                        {email}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="flex gap-2 justify-center lg:justify-start">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-gray-900"
                        />
                      ))}
                    </div>

                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm border border-green-100"
                      >
                        {message}
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm border border-red-100"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={isLoading || otp.some((d) => !d)}
                        className="w-full bg-[#1a1a1a] hover:bg-black text-white h-14 rounded-xl font-semibold text-lg shadow-lg shadow-gray-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify & Login
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-[#D4AF37] to-[#F4C430] opacity-0 group-hover:opacity-10 transition-opacity" />
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
                        >
                          Didn&apos;t receive code? Resend
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
