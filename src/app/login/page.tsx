'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, GraduationCap, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendLoginOTP, verifyOTP } from '@/lib/actions/auth';

type UserType = 'student' | 'teacher';
type Step = 'email' | 'otp';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [userType, setUserType] = useState<UserType>('student');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        const result = await sendLoginOTP(email, userType);

        if (result.success) {
            setMessage(result.message || 'OTP sent to your email');
            setStep('otp');
        } else {
            setError(result.error || 'Failed to send OTP');
        }

        setIsLoading(false);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await verifyOTP(email, otp, userType);

        if (result.success) {
            // Redirect based on user type
            if (userType === 'teacher') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        } else {
            setError(result.error || 'Invalid OTP');
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        const result = await sendLoginOTP(email, userType);

        if (result.success) {
            setMessage('New OTP sent to your email');
        } else {
            setError(result.error || 'Failed to resend OTP');
        }

        setIsLoading(false);
    };

    const handleBack = () => {
        setStep('email');
        setOtp('');
        setError('');
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-20 -mb-20" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] mb-4 shadow-lg shadow-[#D4AF37]/20"
                    >
                        <GraduationCap className="w-10 h-10 text-[#1a1a1a]" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">Econ LMS</h1>
                    <p className="text-gray-400">Welcome back! Please login to continue.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.div
                                key="email-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                {/* User Type Selection */}
                                <div className="mb-6">
                                    <Label className="text-gray-300 mb-3 block">I am a</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setUserType('student')}
                                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${userType === 'student'
                                                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <GraduationCap className="w-5 h-5" />
                                            <span className="font-medium">Student</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUserType('teacher')}
                                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${userType === 'teacher'
                                                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <UserCircle className="w-5 h-5" />
                                            <span className="font-medium">Teacher</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Email Form */}
                                <form onSubmit={handleSendOTP} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-12 bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-14 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                Continue
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* OTP Verification */}
                                <div className="mb-6">
                                    <button
                                        onClick={handleBack}
                                        className="text-gray-400 hover:text-white transition-colors text-sm mb-4"
                                    >
                                        ← Back
                                    </button>
                                    <h2 className="text-2xl font-bold text-white mb-2">Enter OTP</h2>
                                    <p className="text-gray-400 text-sm">
                                        We've sent a 6-digit code to <span className="text-[#D4AF37]">{email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOTP} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">OTP Code</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                required
                                                maxLength={6}
                                                className="pl-12 bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 placeholder:text-gray-600 text-center text-2xl tracking-widest font-bold"
                                            />
                                        </div>
                                    </div>

                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm"
                                        >
                                            {message}
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading || otp.length !== 6}
                                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-14 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify & Login'
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={isLoading}
                                            className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
                                        >
                                            Didn't receive the code? <span className="underline">Resend OTP</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    © {new Date().getFullYear()} Econ LMS. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
