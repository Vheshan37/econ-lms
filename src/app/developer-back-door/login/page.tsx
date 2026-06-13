"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Key, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { sendDevOTP, verifyDevOTP } from "@/lib/actions/dev-auth";

export default function DevLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Password, 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await sendDevOTP(email, password);
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Identity verification failed");
    }
    setIsLoading(false);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await verifyDevOTP(email, otp);
    if (result.success) {
      router.push("/developer-back-door/dashboard");
    } else {
      setError(result.error || "Invalid OTP code");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] mb-6 shadow-2xl shadow-[#D4AF37]/20">
            <Lock className="w-10 h-10 text-[#050505]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-serif tracking-tight">
            Security Gateway
          </h1>
          <p className="text-gray-400">Developer Back-door Access</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Decorative blurred spots */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 transition-all duration-300">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm text-center animate-shake">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300 ml-1">
                    Terminal ID (Email)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dev.local"
                      required
                      className="bg-white/[0.03] border-white/10 text-white pl-12 h-14 rounded-2xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 ml-1">
                    Access Key (Password)
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-white/[0.03] border-white/10 text-white pl-12 h-14 rounded-2xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#050505] font-bold text-lg rounded-2xl shadow-xl shadow-[#D4AF37]/10 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Request Authorization{" "}
                      <ArrowRight className="ml-2 w-5 h-5 text-[#050505]" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleStep2Submit}
                className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm">
                    A multi-factor authentication code was sent to your secure
                    terminal.
                  </p>
                </div>

                <div className="space-y-2 text-center">
                  <Label className="text-gray-300">
                    Verification Code (OTP)
                  </Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="bg-white/[0.03] border-white/10 text-white h-16 text-center text-3xl font-bold tracking-[0.5em] rounded-2xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-800"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#050505] font-bold text-lg rounded-2xl shadow-xl shadow-[#D4AF37]/10 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Verify Identity"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-gray-500 text-sm hover:text-gray-300 transition-colors"
                >
                  Return to Authentication
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">
            Unauthorized access is strictly prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
