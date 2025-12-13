"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
    return (
        <footer className="bg-black text-white border-t border-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <img src="/logo_t.png" alt="Quality Econ" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The premier Economics education platform for Advanced Level students in Sri Lanka. Shaping the future of the nation&apos;s economists.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-yellow-500 transition-colors"><Youtube className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-yellow-500 transition-colors">Home</Link></li>
                            <li><Link href="#" className="hover:text-yellow-500 transition-colors">About Teacher</Link></li>
                            <li><Link href="#" className="hover:text-yellow-500 transition-colors">Courses</Link></li>
                            <li><Link href="/login" className="hover:text-yellow-500 transition-colors">Student Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Classes</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>2025 Theory & Revision</li>
                            <li>2026 Theory</li>
                            <li>2027 Theory</li>
                            <li>Paper Class</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>No. 123, High Level Road, Nugegoda, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>+94 77 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>info@qualityecon.lk</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-900 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 Quality Econ. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-gray-400">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-400">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
