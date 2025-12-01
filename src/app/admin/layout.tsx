"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Users, BookOpen, LogOut, Trophy, Clock, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout } = useStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Classes', href: '/admin/classes', icon: BookOpen },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Timetable', href: '/admin/timetable', icon: Clock },
        { name: 'Hall of Fame', href: '/admin/hall-of-fame', icon: Trophy },
        { name: 'Free Resources', href: '/admin/resources', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 256 }}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-[#1a1a1a] border-r border-gray-800 fixed h-full z-20 hidden md:flex flex-col shadow-2xl"
            >
                <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h1 className="text-xl font-bold text-white">Econ LMS</h1>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Teacher Panel</p>
                            </motion.div>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                        </div>
                    )}
                </div>

                <nav className={`flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar ${isCollapsed ? '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full transition-all duration-200 relative group ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'
                                        } ${isActive
                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-white'} transition-colors`} />
                                    {!isCollapsed && <span>{item.name}</span>}

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] rounded-r-full"
                                        />
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-gray-800 shadow-xl">
                                            {item.name}
                                        </div>
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full text-gray-500 hover:text-white hover:bg-white/5 ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isCollapsed && <span>Collapse Sidebar</span>}
                    </Button>

                    <Link href="/">
                        <Button
                            variant="ghost"
                            className={`w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5" />
                            {!isCollapsed && <span>Logout</span>}
                        </Button>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                animate={{ marginLeft: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 p-8 hidden md:block"
            >
                {children}
            </motion.main>

            {/* Mobile Layout (Unchanged for now, or could be improved) */}
            <main className="flex-1 p-4 md:hidden">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                            <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Econ LMS</h1>
                    </div>
                    {/* Mobile menu trigger could go here */}
                </div>
                {children}
            </main>
        </div>
    );
}
