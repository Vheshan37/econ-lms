"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactPreviewProps {
    data: {
        subtitle: string;
        title: string;
        description: string;
        email: string;
        phone: string;
        address: string;
        formTitle: string;
        officeHours: {
            title: string;
            weekdays: string;
            weekends: string;
        };
    };
}

export function ContactPreview({ data }: ContactPreviewProps) {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Gradient Blobs */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#fdf021]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        {data.title || "Start Your AL Economics Journey Today"}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {data.description || "ප්‍රශ්න තිබේද? ලියාපදිංචි වීමට අවශ්‍යද? අප සමඟ සම්බන්ධ වී ඔබගේ ශාස්ත්‍රීය ඉලක්ක කරා පළමු පියවර තබන්න."}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-6">{data.formTitle || "Send Us a Message"}</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <Input
                                        placeholder="Your name"
                                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fdf021]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fdf021]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <Input
                                    placeholder="+94 XX XXX XXXX"
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fdf021]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <Textarea
                                    placeholder="Tell us about your goals..."
                                    rows={5}
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fdf021]"
                                />
                            </div>
                            <Button
                                type="button"
                                className="group relative w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-[1.02]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Contact Cards */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:bg-[#fdf021]/20 transition-colors">
                                    <Mail className="w-6 h-6 text-[#fdf021]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Email</h4>
                                    <p className="text-gray-400">{data.email || "info@qualityecon.lk"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:bg-[#fdf021]/20 transition-colors">
                                    <Phone className="w-6 h-6 text-[#fdf021]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Phone</h4>
                                    <p className="text-gray-400">{data.phone || "+94 XX XXX XXXX"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:bg-[#fdf021]/20 transition-colors">
                                    <MapPin className="w-6 h-6 text-[#fdf021]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Address</h4>
                                    <p className="text-gray-400">{data.address || "Colombo, Sri Lanka"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        {data.officeHours.title && (
                            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-[#fdf021]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-3">{data.officeHours.title}</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-gray-400">{data.officeHours.weekdays}</p>
                                            <p className="text-gray-400">{data.officeHours.weekends}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
