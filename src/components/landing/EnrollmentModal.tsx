"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    batch?: string;
}

export function EnrollmentModal({ isOpen, onClose, batch }: EnrollmentModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-101 px-4"
                    >
                        <div className="bg-[#111] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="p-8">
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Registration Received!</h3>
                                        <p className="text-gray-400 mb-8">
                                            Thank you for your interest. Our team will contact you shortly to complete your enrollment.
                                        </p>
                                        <Button
                                            onClick={onClose}
                                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 rounded-xl"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
                                            <p className="text-gray-400 text-sm">
                                                Enrollment for <span className="text-yellow-500 font-semibold">{batch || "A/L Economics"}</span>
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    className="w-full h-12 rounded-xl bg-black/50 border border-gray-800 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">WhatsApp Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="07X XXXXXXX"
                                                    className="w-full h-12 rounded-xl bg-black/50 border border-gray-800 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    className="w-full h-12 rounded-xl bg-black/50 border border-gray-800 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 rounded-xl text-lg shadow-lg shadow-yellow-500/20"
                                                >
                                                    Submit Registration
                                                </Button>
                                            </div>

                                            <p className="text-xs text-center text-gray-500 mt-4">
                                                We'll respond within 24 hours. No payment required now.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
