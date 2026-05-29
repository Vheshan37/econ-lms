"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { getLandingPageContent } from "@/lib/actions/content";
import dynamic from 'next/dynamic';

// Dynamically import LocationMap to avoid SSR issues with Leaflet
const LocationMap = dynamic(() => import('@/components/LocationMap').then(mod => ({ default: mod.LocationMap })), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-900 rounded-2xl animate-pulse" />
});

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        institute: "",
        year: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [contactContent, setContactContent] = useState<any>({
        email: 'info@economicslms.lk',
        phone: '+94 11 234 5678',
        address: '123, Galle Road, Colombo 03, Sri Lanka',
        formTitle: 'Send Us a Message',
        locations: [
            { name: 'Main Institute', address: 'Colombo', latitude: '6.9271', longitude: '79.8612' },
            { name: 'Branch Institute', address: 'Nugegoda', latitude: '6.8649', longitude: '79.8997' }
        ],
        officeHours: { weekdays: '9:00 AM - 6:00 PM', weekends: '9:00 AM - 3:00 PM' }
    });

    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await getLandingPageContent('contact');
                if (response.success && response.data) {
                    setContactContent((prev: any) => ({ ...prev, ...response.data }));
                }
            } catch (error) {
                console.error("Failed to load contact content:", error);
            }
        };
        loadContent();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to a backend
        console.log("Form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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
                        Start Your AL Economics Journey Today
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        ප්‍රශ්න තිබේද? ලියාපදිංචි වීමට අවශ්‍යද? අප සමඟ සම්බන්ධ වී ඔබගේ ශාස්ත්‍රීය ඉලක්ක කරා පළමු පියවර තබන්න.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800">
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {contactContent.formTitle || "Send Us a Message"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                        placeholder="+94 XX XXX XXXX"
                                    />
                                </div>
                            </div>

                            {/* Institute & Year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="institute" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Preferred Institute
                                    </label>
                                    <select
                                        id="institute"
                                        name="institute"
                                        value={formData.institute}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                    >
                                        <option value="">Select Institute</option>
                                        {contactContent.locations?.map((loc: any, idx: number) => (
                                            <option key={idx} value={loc.name.toLowerCase()}>{loc.name}</option>
                                        ))}
                                        {!contactContent.locations?.length && (
                                            <>
                                                <option value="colombo">Colombo Institute</option>
                                                <option value="gampaha">Gampaha Institute</option>
                                            </>
                                        )}
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="year" className="block text-sm font-semibold text-gray-300 mb-2">
                                        Academic Year
                                    </label>
                                    <select
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="year12">Year 12</option>
                                        <option value="year13">Year 13</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-[#fdf021] focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
                                    placeholder="Tell us about your goals or any questions you have..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitted}
                                className="group relative w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {submitted ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            Send Message
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        {/* Contact Information Cards */}
                        <div className="space-y-4">
                            {contactContent.phone && (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Phone className="w-6 h-6 text-[#fdf021]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Phone</h4>
                                            <a href={`tel:${contactContent.phone}`} className="text-gray-400 hover:text-[#fdf021] transition-colors">
                                                {contactContent.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contactContent.email && (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Mail className="w-6 h-6 text-[#fdf021]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Email</h4>
                                            <a href={`mailto:${contactContent.email}`} className="text-gray-400 hover:text-[#fdf021] transition-colors">
                                                {contactContent.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contactContent.address && (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#fdf021]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <MapPin className="w-6 h-6 text-[#fdf021]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Main Office</h4>
                                            <p className="text-gray-400">
                                                {contactContent.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Consolidated Map showing all locations */}
                        {contactContent.locations && contactContent.locations.some((loc: any) => loc.latitude && loc.longitude) && (
                            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-2 border border-gray-800 overflow-hidden">
                                <h4 className="text-white font-semibold px-4 pt-4 pb-2">📍 Institute Locations</h4>
                                <LocationMap locations={contactContent.locations} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Office Hours */}
                <div className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-transparent rounded-2xl p-8 border border-[#fdf021]/20">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">📅 Office Hours</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-gray-400 text-sm">Weekdays</p>
                            <p className="text-white font-semibold">{contactContent.officeHours?.weekdays || "9:00 AM - 6:00 PM"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Weekends</p>
                            <p className="text-white font-semibold">{contactContent.officeHours?.weekends || "9:00 AM - 3:00 PM"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
