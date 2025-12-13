"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// NavbarProps removed as it is now empty.
export function Navbar() {
    const { currentUser, logout } = useStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Hall of Fame", path: "/hall-of-fame" },
        { name: "O/L Student?", path: "/ol-students" },
        { name: "Contact Us", path: "/contact" },
    ];

    return (
        <>
            <nav className={cn(
                "transition-all duration-300 border-b border-white/10 sticky top-0 z-50",
                !isMobileMenuOpen && "backdrop-blur-md", // Only blur when menu is closed
                isMobileMenuOpen && "bg-transparent border-b-0" // Transparent header to let overlay show through
            )}>
                <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-50">
                    <Link href="/" className="relative h-full min-w-[120px]">
                        <Image
                            src="/logo_t.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-yellow-500 relative group text-gray-300"
                                )}
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* PC Login/User Section */}
                        <div className="hidden md:flex items-center gap-4">
                            {currentUser ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <UserIcon className="h-4 w-4" />
                                        {currentUser.name}
                                    </div>
                                    <Link href={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-white/20 text-white hover:bg-white hover:text-black"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        className="text-white hover:bg-white/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button
                                        className="bg-yellow-500 text-black hover:bg-yellow-400"
                                    >
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-8 h-8 text-yellow-500" />
                            ) : (
                                <Menu className="w-8 h-8 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden pt-24 px-6 flex flex-col items-center"
                        style={{ background: "linear-gradient(to bottom, #000000, #030712, #451a03)" }}
                    >
                        {/* Decorative background elements for "stunning" effect */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                        <nav className="flex flex-col items-center gap-8 w-full max-w-sm relative z-10">
                            {navLinks.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center text-2xl font-serif font-bold text-white hover:text-yellow-500 transition-colors py-4 border-b border-white/10"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full pt-8 flex flex-col gap-4"
                            >
                                {currentUser ? (
                                    <>
                                        <div className="text-center text-gray-400 mb-2">
                                            Signed in as <span className="text-yellow-500">{currentUser.name}</span>
                                        </div>
                                        <Link href={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg">
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full border-gray-700 text-gray-400 hover:text-white hover:border-white h-12"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 h-14 text-xl font-bold rounded-xl shadow-lg shadow-yellow-500/20">
                                            Login Now
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
