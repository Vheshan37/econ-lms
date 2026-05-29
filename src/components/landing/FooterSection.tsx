"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import { getLandingPageContent } from "@/lib/actions/content";

export function FooterSection() {
    const [footerContent, setFooterContent] = useState({
        logoText: 'Quality Econ',
        description: "The premier Economics education platform for Advanced Level students in Sri Lanka. Shaping the future of the nation's economists.",
        socialLinks: { facebook: '#', youtube: '#', telegram: '#' },
        quickLinks: [
            { title: "Home", url: "#" },
            { title: "About Teacher", url: "#" },
            { title: "Courses", url: "#" },
            { title: "Student Portal", url: "/login" }
        ],
        contactInfo: {
            address: "No. 123, High Level Road, Nugegoda, Sri Lanka",
            phone: "+94 77 123 4567",
            email: "info@qualityecon.lk"
        },
        copyright: "© 2025 Quality Econ. All rights reserved."
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await getLandingPageContent('footer');
                if (response.success && response.data) {
                    setFooterContent(prev => ({ ...prev, ...response.data }));
                }
            } catch (error) {
                console.error("Failed to load footer content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    return (
        <footer className="bg-black text-white border-t border-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <img src="/logo_t.png" alt="Quality Econ" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {footerContent.description}
                        </p>
                        <div className="flex gap-4">
                            {footerContent.socialLinks.facebook && (
                                <Link href={footerContent.socialLinks.facebook} className="text-gray-400 hover:text-[#fdf021] transition-colors"><Facebook className="h-5 w-5" /></Link>
                            )}
                            {footerContent.socialLinks.telegram && (
                                <Link href={footerContent.socialLinks.telegram} className="text-gray-400 hover:text-[#fdf021] transition-colors"><Instagram className="h-5 w-5" /></Link>
                            )}
                            {footerContent.socialLinks.youtube && (
                                <Link href={footerContent.socialLinks.youtube} className="text-gray-400 hover:text-[#fdf021] transition-colors"><Youtube className="h-5 w-5" /></Link>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {footerContent.quickLinks?.map((link, idx) => (
                                <li key={idx}><Link href={link.url} className="hover:text-[#fdf021] transition-colors">{link.title}</Link></li>
                            ))}
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
                                <MapPin className="h-5 w-5 text-[#fdf021] shrink-0" />
                                <span>{footerContent.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#fdf021] shrink-0" />
                                <span>{footerContent.contactInfo.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-[#fdf021] shrink-0" />
                                <span>{footerContent.contactInfo.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-gray-600">
                        {footerContent.copyright}
                    </p>
                    <div className="text-xs text-gray-700 max-w-lg mx-auto">
                        <p>Developed by Quantum Blaze</p>
                        <p className="mt-1"><Link href={"mailto:contact@quantumblaze.lk"}>contact@quantumblaze.lk</Link> | Website: <Link href="https://quantumblaze.lk" target="_blank" className="text-blue-500 hover:text-blue-600 transition-colors">Quantum Blaze</Link></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
